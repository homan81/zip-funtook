'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  product: {
    id: number;
    productName: string;
    productImage?: string;
    price: number;
    sellingPrice: number;
    stockQuantity?: number;
    variants?: Array<{ name: string; options: string[] }>;
  };
  className?: string;
  showQuantityControls?: boolean;
}

export default function AddToCartButton({
  product,
  className = '',
  showQuantityControls = false,
}: AddToCartButtonProps) {
  const { addToCart, updateQuantity, getCartItem, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Initialize variant selections
  React.useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const initial: Record<string, string> = {};
      product.variants.forEach(variant => {
        if (variant.options && variant.options.length > 0) {
          initial[variant.name] = variant.options[0];
        }
      });
      setSelectedVariants(initial);
    }
  }, [product.variants]);

  const handleAddToCart = async () => {
    // Validate variants are selected
    if (product.variants && product.variants.length > 0) {
      const allSelected = product.variants.every(
        variant => selectedVariants[variant.name]
      );
      if (!allSelected) {
        toast.error('Please select all variant options');
        return;
      }
    }

    // Check stock
    if (product.stockQuantity !== undefined && quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items available in stock`);
      return;
    }

    if (product.stockQuantity !== undefined && product.stockQuantity === 0) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAdding(true);
    try {
      addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
      // Reset quantity after adding
      if (!showQuantityControls) {
        setQuantity(1);
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    if (product.stockQuantity && newQuantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} items available in stock`);
      return;
    }
    setQuantity(newQuantity);
  };

  const cartItem = getCartItem(product.id, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);
  const inCart = isInCart(product.id, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Variant Selectors */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          {product.variants.map((variant) => (
            <div key={variant.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {variant.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSelectedVariants(prev => ({
                        ...prev,
                        [variant.name]: option,
                      }))
                    }
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedVariants[variant.name] === option
                        ? 'bg-[#FC6E88] text-white border-[#FC6E88]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#FC6E88]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Controls */}
      {showQuantityControls && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={product.stockQuantity ? quantity >= product.stockQuantity : false}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || (product.stockQuantity !== undefined && product.stockQuantity === 0)}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
          inCart
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-[#FC6E88] hover:bg-[#fc6e88d0]'
        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        <ShoppingCart className="w-5 h-5" />
        {isAdding
          ? 'Adding...'
          : inCart
          ? `In Cart (${cartItem?.quantity})`
          : 'Add to Cart'}
      </button>

      {/* Stock Info */}
      {product.stockQuantity !== undefined && (
        <p className="text-sm text-gray-600">
          {product.stockQuantity > 0
            ? `${product.stockQuantity} items in stock`
            : 'Out of stock'}
        </p>
      )}
    </div>
  );
}

