# Cart API - Quick Reference for Frontend

## Add to Cart API

**Endpoint:** `POST /api/cart`

### Request

```javascript
fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: 123,           // Required: Product ID
    quantity: 1,              // Optional: Default is 1
    selectedVariants: {       // Optional: Product variants
      "Color": "Red",
      "Size": "Large"
    }
  })
})
```

### Response (Success)

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
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "message": "Only 5 items available in stock",
  "availableStock": 5
}
```

---

## Quick Example

```javascript
// Simple function to add product to cart
async function addToCart(productId, quantity = 1, variants = {}) {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity, selectedVariants: variants })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Use data.cartItem to add to your cart
    return data.cartItem;
  } else {
    // Show error: data.message
    throw new Error(data.message);
  }
}

// Usage
try {
  const cartItem = await addToCart(123, 2, { Color: 'Red' });
  console.log('Added:', cartItem);
} catch (error) {
  alert(error.message);
}
```

---

## What the API Does

✅ Validates product exists  
✅ Checks stock availability  
✅ Returns cart item data structure  
✅ Handles variant selection  

## What You Need to Do

1. Call the API with product details
2. Check `success` field in response
3. If successful, use `cartItem` data to add to your cart state
4. If error, show `message` to user

---

## Full Documentation

See `app/api/cart/API_DOCUMENTATION.md` for complete documentation and examples.

