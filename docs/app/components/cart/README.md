# Cart Module Documentation

This cart module provides a complete shopping cart functionality for your Next.js application.

## Features

- ✅ Add products to cart with quantity selection
- ✅ Support for product variants (e.g., Color, Size)
- ✅ Stock quantity validation
- ✅ Persistent cart using localStorage
- ✅ Cart icon with item count badge
- ✅ Full cart page with item management
- ✅ Update/remove items from cart
- ✅ Calculate totals and subtotals
- ✅ Responsive design

## Components

### 1. CartProvider
Wraps your application and provides cart context to all components.

**Location:** `app/contexts/CartContext.tsx`

**Usage:**
```tsx
import { CartProvider } from '@/app/contexts/CartContext';

export default function RootLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
```

### 2. AddToCartButton
Button component to add products to cart with variant selection.

**Location:** `app/components/cart/AddToCartButton.tsx`

**Props:**
- `product`: Product object with id, productName, productImage, price, sellingPrice, stockQuantity, variants
- `className`: Optional CSS classes
- `showQuantityControls`: Show quantity +/- buttons (default: false)

**Usage:**
```tsx
import AddToCartButton from '@/app/components/cart/AddToCartButton';

<AddToCartButton
  product={{
    id: 1,
    productName: "Product Name",
    productImage: "/image.jpg",
    price: 100,
    sellingPrice: 80,
    stockQuantity: 10,
    variants: [
      { name: "Color", options: ["Red", "Blue"] },
      { name: "Size", options: ["S", "M", "L"] }
    ]
  }}
  showQuantityControls={true}
/>
```

### 3. CartIcon
Cart icon with item count badge for navigation.

**Location:** `app/components/cart/CartIcon.tsx`

**Props:**
- `className`: Optional CSS classes
- `showCount`: Show item count badge (default: true)

**Usage:**
```tsx
import CartIcon from '@/app/components/cart/CartIcon';

<CartIcon className="mr-4" />
```

### 4. CartItem
Individual cart item component for displaying items in cart.

**Location:** `app/components/cart/CartItem.tsx`

**Props:**
- `item`: CartItem object

**Usage:**
```tsx
import CartItem from '@/app/components/cart/CartItem';
import { useCart } from '@/app/contexts/CartContext';

const { cartItems } = useCart();

{cartItems.map(item => (
  <CartItem key={item.id} item={item} />
))}
```

## Cart Context API

### useCart Hook

```tsx
import { useCart } from '@/app/contexts/CartContext';

const {
  cartItems,           // Array of cart items
  addToCart,           // Function to add product to cart
  removeFromCart,      // Function to remove item from cart
  updateQuantity,      // Function to update item quantity
  clearCart,           // Function to clear all items
  getTotalItems,       // Function to get total item count
  getTotalPrice,       // Function to get total price
  isInCart,           // Function to check if product is in cart
  getCartItem,        // Function to get cart item by productId
} = useCart();
```

### Methods

#### addToCart(product, quantity?, selectedVariants?)
Adds a product to the cart or updates quantity if already exists.

```tsx
addToCart(product, 2, { Color: "Red", Size: "L" });
```

#### removeFromCart(itemId)
Removes an item from the cart.

```tsx
removeFromCart(itemId);
```

#### updateQuantity(itemId, quantity)
Updates the quantity of a cart item.

```tsx
updateQuantity(itemId, 3);
```

#### clearCart()
Clears all items from the cart.

```tsx
clearCart();
```

#### getTotalItems()
Returns the total number of items in the cart.

```tsx
const total = getTotalItems();
```

#### getTotalPrice()
Returns the total price of all items in the cart.

```tsx
const total = getTotalPrice();
```

#### isInCart(productId, selectedVariants?)
Checks if a product with specific variants is in the cart.

```tsx
const inCart = isInCart(productId, { Color: "Red" });
```

#### getCartItem(productId, selectedVariants?)
Gets a cart item by product ID and variants.

```tsx
const item = getCartItem(productId, { Color: "Red" });
```

## Pages

### Cart Page
**Location:** `app/cart/page.tsx`

Displays all cart items with:
- Item details and images
- Quantity controls
- Remove item functionality
- Order summary with totals
- Proceed to checkout button

Access at: `/cart`

### Product Detail Page
**Location:** `app/products/[id]/page.tsx`

Example product detail page showing how to use AddToCartButton.

Access at: `/products/[id]`

## API Routes

### Cart API
**Location:** `app/api/cart/route.ts`

Currently, cart is managed client-side via localStorage. The API routes are prepared for future server-side cart persistence if needed.

## Database Schema

**Location:** `database/cart_schema.sql`

Optional database schema for server-side cart persistence. Currently not required as cart uses localStorage.

## Storage

Cart data is stored in browser localStorage with key `funtook_cart`. The cart persists across page refreshes and browser sessions.

## Example Usage

### Basic Product Card with Add to Cart

```tsx
'use client';

import AddToCartButton from '@/app/components/cart/AddToCartButton';
import CartIcon from '@/app/components/cart/CartIcon';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.productImage} alt={product.productName} />
      <h3>{product.productName}</h3>
      <p>₹{product.sellingPrice}</p>
      <AddToCartButton product={product} />
    </div>
  );
}
```

### Header with Cart Icon

```tsx
'use client';

import CartIcon from '@/app/components/cart/CartIcon';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My Store</h1>
      <CartIcon />
    </header>
  );
}
```

## Notes

- Cart persists in localStorage
- Supports product variants
- Validates stock quantity
- Responsive design
- TypeScript support
- Toast notifications for user feedback

