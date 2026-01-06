/**
 * Cart API Usage Examples
 *
 * This file contains example code for integrating the Cart API
 * into your frontend application.
 */

// ============================================
// Example 1: Basic Add to Cart
// ============================================

async function addToCartBasic(productId, quantity = 1) {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Product validated:", data.cartItem);
      return data.cartItem;
    } else {
      console.error("Error:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return null;
  }
}

// Usage:
// const cartItem = await addToCartBasic(123, 2);

// ============================================
// Example 2: Add to Cart with Variants
// ============================================

async function addToCartWithVariants(productId, quantity, variants) {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
        selectedVariants: variants,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        cartItem: data.cartItem,
        product: data.product,
      };
    } else {
      return {
        success: false,
        error: data.message,
        availableStock: data.availableStock,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Network error: " + error.message,
    };
  }
}

// Usage:
// const result = await addToCartWithVariants(123, 1, {
//   Color: 'Red',
//   Size: 'Large',
// });

// ============================================
// Example 3: React Hook for Add to Cart
// ============================================

/*
import { useState } from 'react';

function useAddToCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToCart = async (productId, quantity = 1, selectedVariants = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          selectedVariants,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, cartItem: data.cartItem };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMsg = 'Failed to add to cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
}

// Usage in component:
// const { addToCart, loading, error } = useAddToCart();
// await addToCart(productId, 1, { Color: 'Red' });
*/

// ============================================
// Example 4: Complete Product Card Component
// ============================================

/*
import React, { useState } from 'react';

function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          selectedVariants,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add to your cart context/state here
        // addToCartContext(data.cartItem);
        alert('Added to cart successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <h3>{product.productName}</h3>
      <p>Price: ₹{product.sellingPrice}</p>
      
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min="1"
      />
      
      <button onClick={handleAddToCart} disabled={loading}>
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
*/

// ============================================
// Example 5: Error Handling with User Feedback
// ============================================

async function addToCartWithFeedback(
  productId,
  quantity,
  variants,
  onSuccess,
  onError
) {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
        selectedVariants: variants,
      }),
    });

    const data = await response.json();

    if (data.success) {
      if (onSuccess) onSuccess(data.cartItem);
      return { success: true, cartItem: data.cartItem };
    } else {
      const errorMsg = data.message || "Failed to add to cart";
      if (onError) onError(errorMsg, data.availableStock);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    const errorMsg = "Network error. Please check your connection.";
    if (onError) onError(errorMsg);
    return { success: false, error: errorMsg };
  }
}

// Usage:
/*
addToCartWithFeedback(
  123,
  2,
  { Color: 'Red' },
  (cartItem) => {
    console.log('Success!', cartItem);
    // Show success message
  },
  (error, availableStock) => {
    console.error('Error:', error);
    if (availableStock) {
      // Show stock limit message
    } else {
      // Show general error
    }
  }
);
*/

// ============================================
// Example 6: Batch Add Multiple Products
// ============================================

async function addMultipleToCart(items) {
  const results = [];

  for (const item of items) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity || 1,
          selectedVariants: item.variants || {},
        }),
      });

      const data = await response.json();
      results.push({
        productId: item.productId,
        success: data.success,
        cartItem: data.cartItem,
        error: data.message,
      });
    } catch (error) {
      results.push({
        productId: item.productId,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

// Usage:
/*
const items = [
  { productId: 123, quantity: 1 },
  { productId: 456, quantity: 2, variants: { Color: 'Blue' } },
];
const results = await addMultipleToCart(items);
*/

// ============================================
// Export for use in other files
// ============================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    addToCartBasic,
    addToCartWithVariants,
    addToCartWithFeedback,
    addMultipleToCart,
  };
}
