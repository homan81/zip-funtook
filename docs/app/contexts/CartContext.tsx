'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// Types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  sellingPrice: number;
  quantity: number;
  selectedVariants?: Record<string, string>; // e.g., { "Color": "Red", "Size": "Large" }
  stockQuantity?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: number, selectedVariants?: Record<string, string>) => boolean;
  getCartItem: (productId: number, selectedVariants?: Record<string, string>) => CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'funtook_cart';

// Helper to generate unique cart item ID
const generateCartItemId = (productId: number, selectedVariants?: Record<string, string>): number => {
  const variantString = selectedVariants 
    ? JSON.stringify(selectedVariants) 
    : '';
  const uniqueString = `${productId}_${variantString}`;
  return uniqueString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

// Helper to compare variants
const variantsMatch = (v1?: Record<string, string>, v2?: Record<string, string>): boolean => {
  if (!v1 && !v2) return true;
  if (!v1 || !v2) return false;
  const keys1 = Object.keys(v1).sort();
  const keys2 = Object.keys(v2).sort();
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => v1[key] === v2[key]);
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session, status } = useSession();
  const syncTimeout = useRef<number | null>(null);
  const mergedOnceRef = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  // Helper: normalize server item to CartItem shape
  const normalizeServerItem = (row: any): CartItem => {
    let variants = null;
    try {
      if (row.selected_variants) {
        variants = typeof row.selected_variants === 'string' ? JSON.parse(row.selected_variants) : row.selected_variants;
      }
    } catch (e) {
      variants = null;
    }

    return {
      id: generateCartItemId(Number(row.product_id), variants),
      productId: Number(row.product_id),
      productName: row.product_name || row.productName || '',
      productImage: row.product_image || row.productImage || '/placeholder.png',
      price: Number(row.price || 0),
      sellingPrice: Number(row.selling_price || row.sellingPrice || row.price || 0),
      quantity: Number(row.quantity || 1),
      selectedVariants: variants || undefined,
    };
  };

  // Merge server + local carts (sum quantities for same product+variants)
  const mergeCarts = (local: CartItem[], server: any[]): CartItem[] => {
    const map = new Map<string, CartItem>();
    const keyOf = (item: { productId: number; selectedVariants?: Record<string,string> }) => `${item.productId}::${item.selectedVariants? JSON.stringify(item.selectedVariants): ''}`;

    const add = (item: CartItem) => {
      const k = keyOf(item);
      if (map.has(k)) {
        const existing = map.get(k)!;
        existing.quantity = existing.quantity + item.quantity;
      } else {
        map.set(k, { ...item });
      }
    };

    local.forEach(add);
    server.map(normalizeServerItem).forEach(add);

    return Array.from(map.values());
  };

  // Sync local cart to server (replace server cart with provided items)
  const postCartToServer = useCallback(async (items: CartItem[]) => {
    try {
      const payload = items.map(i => ({ product_id: i.productId, quantity: i.quantity, selected_variants: i.selectedVariants || null }));
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error syncing cart to server', err);
    }
  }, []);

  // On auth state change: when user becomes authenticated, merge guest local cart with server cart and persist
  useEffect(() => {
    if (status === 'authenticated') {
      if (mergedOnceRef.current) return; // avoid repeated merges on refresh
      (async () => {
        try {
          // read local guest cart
          let local = [] as CartItem[];
          try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            local = stored ? (JSON.parse(stored) as CartItem[]) : [];
            // sanitize
            local = Array.isArray(local) ? local.filter(it => it && (it.productId || it.productId === 0)) : [];
          } catch (e) {
            local = [];
          }

          const res = await fetch('/api/cart', { credentials: 'include' });
          if (!res.ok) return;
          const data = await res.json();
          const serverItems = Array.isArray(data.items) ? data.items : [];

          // Merge guest local cart with server cart (sum quantities)
          const merged = mergeCarts(local, serverItems);

          // Persist merged cart to server (bulk replace) - server will associate with authenticated user
          await postCartToServer(merged);

          // Update local state and localStorage with merged authoritative cart
          setCartItems(merged);
          try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(merged)); } catch (e) { /* ignore */ }

          mergedOnceRef.current = true;
        } catch (err) {
          console.error('Error merging carts on auth', err);
        }
      })();
    } else {
      // reset merge guard on sign-out
      mergedOnceRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // When authenticated and cart changes, debounce syncing to server
  useEffect(() => {
    if (status !== 'authenticated') return;
    if (syncTimeout.current) window.clearTimeout(syncTimeout.current);
    syncTimeout.current = window.setTimeout(() => {
      postCartToServer(cartItems);
    }, 800);
    return () => { if (syncTimeout.current) window.clearTimeout(syncTimeout.current); };
  }, [cartItems, status, postCartToServer]);

  const addToCart = useCallback((
    product: any,
    quantity: number = 1,
    selectedVariants?: Record<string, string>
  ) => {
    setCartItems(prev => {
      // Check if product with same variants already exists
      const existingIndex = prev.findIndex(
        item => 
          item.productId === product.id && 
          variantsMatch(item.selectedVariants, selectedVariants)
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const existingItem = prev[existingIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (existingItem.stockQuantity && newQuantity > existingItem.stockQuantity) {
          toast.error(`Only ${existingItem.stockQuantity} items available in stock`);
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        toast.success(`Updated quantity to ${newQuantity}`);
        return updated;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: generateCartItemId(product.id, selectedVariants),
          productId: product.id,
          productName: product.productName || product.name,
          productImage: product.productImage || product.image || '/placeholder.png',
          price: product.price || 0,
          sellingPrice: product.sellingPrice || product.price || 0,
          quantity,
          selectedVariants,
          stockQuantity: product.stockQuantity,
        };

        // Check stock availability
        if (newItem.stockQuantity && quantity > newItem.stockQuantity) {
          toast.error(`Only ${newItem.stockQuantity} items available in stock`);
          return prev;
        }

        toast.success('Added to cart!');
        return [...prev, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setCartItems(prev => {
      const filtered = prev.filter(item => item.id !== itemId);
      if (filtered.length < prev.length) {
        toast.success('Item removed from cart');
      }
      return filtered;
    });
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => {
      const item = prev.find(i => i.id === itemId);
      if (item && item.stockQuantity && quantity > item.stockQuantity) {
        toast.error(`Only ${item.stockQuantity} items available in stock`);
        return prev;
      }

      return prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success('Cart cleared');
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
  }, [cartItems]);

  const isInCart = useCallback((productId: number, selectedVariants?: Record<string, string>) => {
    return cartItems.some(
      item => 
        item.productId === productId && 
        variantsMatch(item.selectedVariants, selectedVariants)
    );
  }, [cartItems]);

  const getCartItem = useCallback((productId: number, selectedVariants?: Record<string, string>) => {
    return cartItems.find(
      item => 
        item.productId === productId && 
        variantsMatch(item.selectedVariants, selectedVariants)
    ) || null;
  }, [cartItems]);

  // Always provide the context, even during loading
  // This ensures useCart can be called immediately
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

