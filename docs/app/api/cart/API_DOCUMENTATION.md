# Cart API Documentation

This document describes the Cart API endpoints for adding, updating, and managing cart items.

## Base URL
```
/api/cart
```

---

## Endpoints

### 1. Add Item to Cart

**Endpoint:** `POST /api/cart`

**Description:** Validates a product and returns cart item data that can be added to the cart.

**Request Body:**
```json
{
  "productId": 123,
  "quantity": 1,
  "selectedVariants": {
    "Color": "Red",
    "Size": "Large"
  }
}
```

**Request Parameters:**
- `productId` (required, number): The ID of the product to add
- `quantity` (optional, number, default: 1): Quantity to add
- `selectedVariants` (optional, object): Selected variant options (e.g., Color, Size)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product validated and ready to add to cart",
  "cartItem": {
    "productId": 123,
    "productName": "Product Name",
    "productImage": "/uploads/products/image.jpg",
    "price": 100.00,
    "sellingPrice": 80.00,
    "quantity": 1,
    "selectedVariants": {
      "Color": "Red",
      "Size": "Large"
    },
    "stockQuantity": 10
  },
  "product": {
    "id": 123,
    "productName": "Product Name",
    "productImage": "/uploads/products/image.jpg",
    "price": 100.00,
    "sellingPrice": 80.00,
    "stockQuantity": 10
  }
}
```

**Error Responses:**

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Product ID is required"
}
```

**400 - Stock Unavailable:**
```json
{
  "success": false,
  "message": "Only 5 items available in stock",
  "availableStock": 5
}
```

**404 - Product Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Failed to add to cart"
}
```

---

### 2. Get Cart (Future: Server-side cart)

**Endpoint:** `GET /api/cart?userId=123`

**Description:** Retrieves user's cart items (currently returns empty as cart is client-side).

**Query Parameters:**
- `userId` (optional): User ID for authenticated users

**Response:**
```json
{
  "success": true,
  "message": "Cart is managed client-side via localStorage",
  "cart": []
}
```

---

### 3. Update Cart Item Quantity

**Endpoint:** `PUT /api/cart`

**Description:** Updates the quantity of a cart item (prepared for server-side cart).

**Request Body:**
```json
{
  "userId": 123,
  "itemId": 456,
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated"
}
```

---

### 4. Remove Item from Cart

**Endpoint:** `DELETE /api/cart?userId=123&itemId=456`

**Description:** Removes an item from the cart (prepared for server-side cart).

**Query Parameters:**
- `userId` (optional): User ID
- `itemId` (required): Cart item ID to remove

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## Frontend Integration Examples

### JavaScript/Fetch Example

```javascript
// Add to cart
async function addToCart(productId, quantity = 1, selectedVariants = {}) {
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
      // Use the cartItem data to add to client-side cart
      console.log('Product validated:', data.cartItem);
      // Add to your cart state/context here
      return data.cartItem;
    } else {
      console.error('Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return null;
  }
}

// Usage
const cartItem = await addToCart(123, 2, { Color: 'Red', Size: 'Large' });
```

### React Example

```jsx
import { useState } from 'react';

function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

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
          quantity: 1,
          selectedVariants: {
            Color: 'Red',
            Size: 'Large',
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add to your cart context/state
        addToCartContext(data.cartItem);
        alert('Added to cart!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Axios Example

```javascript
import axios from 'axios';

// Add to cart
async function addToCart(productId, quantity = 1, selectedVariants = {}) {
  try {
    const response = await axios.post('/api/cart', {
      productId,
      quantity,
      selectedVariants,
    });

    if (response.data.success) {
      return response.data.cartItem;
    }
    return null;
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.message);
    } else {
      console.error('Network error:', error.message);
    }
    return null;
  }
}
```

---

## Current Implementation

**Note:** Currently, the cart is managed **client-side** using localStorage. The API endpoints:
- **POST /api/cart**: Validates products and returns cart item data
- Other endpoints are prepared for future server-side cart implementation

**Client-side cart storage:**
- Uses React Context (`CartContext`)
- Persists in browser localStorage
- Key: `funtook_cart`

---

## Error Handling

Always check the `success` field in the response:

```javascript
const response = await fetch('/api/cart', { ... });
const data = await response.json();

if (data.success) {
  // Handle success
} else {
  // Handle error - data.message contains error message
  console.error(data.message);
}
```

---

## Stock Validation

The API automatically validates:
- Product exists
- Stock availability
- Quantity limits
- Out of stock status

Always handle stock-related errors gracefully in your frontend.

---

## Next Steps (Optional)

For server-side cart persistence:
1. Implement user authentication
2. Use the database schema in `database/cart_schema.sql`
3. Update API endpoints to save/retrieve from database
4. Sync client-side and server-side carts

