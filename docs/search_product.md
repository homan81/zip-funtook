# Product Search API Documentation

## Overview
Production-ready POST endpoint for searching and filtering products with advanced options including price range, categories, tags, location availability, and full pagination support.

---

## Endpoint

**URL:** `/api/products/search`  
**Method:** `POST`  
**Content-Type:** `application/json`

---

## Request Body

All fields are **optional**. If a filter is `null`, `undefined`, or an empty array, it will be skipped.

```typescript
interface SearchRequest {
  // Text search
  search?: string;                      // Search in product name and description
  
  // Price filters
  minPrice?: number;                    // Minimum selling price (inclusive)
  maxPrice?: number;                    // Maximum selling price (inclusive)
  
  // Category filters (support both ID and name)
  categories?: Array<number | string>;  // Category IDs or names
  subcategories?: Array<number | string>; // Subcategory IDs or names
  
  // Tag filters (support both ID and name)
  tags?: Array<number | string>;        // Product tags (e.g., "trending", "best seller")
  
  // Location filters (support both ID and name)
  cities?: Array<number | string>;      // City names or IDs for availability
  
  // Pagination
  page?: number;                        // Page number (default: 1, min: 1)
  limit?: number;                       // Items per page (default: 10, max: 100)
  
  // Sorting
  sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
}
```

---

## Response Format

### Success Response (200 OK)

```typescript
interface SearchResponse {
  success: true;
  data: Product[];
  pagination: PaginationMeta;
  filters: AppliedFilters;
}

interface Product {
  id: number;
  productName: string;
  slug: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  productImage: string;
  price: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  unit: string;
  stockQuantity: number;
  locationAvailability: string[];       // Array of city names
  product_tags: string[];               // Array of tags
  metaTitle: string | null;
  metaKeywords: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  created_at: string;
  updated_at: string | null;
  gallery: string[];                    // Array of image URLs
  variants: Variant[];
}

interface Variant {
  id: number;
  name: string;                         // e.g., "Color", "Size"
  options: string[];                    // e.g., ["Red", "Blue", "Green"]
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AppliedFilters {
  search: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  categories: Array<number | string>;
  subcategories: Array<number | string>;
  tags: Array<number | string>;
  cities: Array<number | string>;
  sortBy: string;
}
```

### Error Response (500)

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;  // Stack trace (only in development)
}
```

---

## Examples

### Example 1: Basic Search with Text

```javascript
const response = await fetch('/api/products/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    search: "balloon",
    page: 1,
    limit: 10
  })
});

const data = await response.json();
console.log(data.data);        // Array of products
console.log(data.pagination);  // Pagination metadata
```

### Example 2: Price Range Filter

```javascript
const response = await fetch('/api/products/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    minPrice: 100,
    maxPrice: 500,
    sortBy: "price_asc"
  })
});
```

### Example 3: Category and Location Filter

```javascript
const response = await fetch('/api/products/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    categories: ["Party Supplies", 5],  // Mix of names and IDs
    cities: ["Mumbai", "Delhi"],
    page: 1,
    limit: 20
  })
});
```

### Example 4: Advanced Multi-Filter Search

```javascript
const response = await fetch('/api/products/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    search: "party decoration",
    minPrice: 50,
    maxPrice: 1000,
    categories: ["Party Supplies"],
    subcategories: ["Balloons"],
    tags: ["trending", "best seller"],
    cities: ["Mumbai", "Pune"],
    page: 1,
    limit: 20,
    sortBy: "price_asc"
  })
});

const data = await response.json();

if (data.success) {
  console.log(`Found ${data.pagination.totalItems} products`);
  console.log(`Showing page ${data.pagination.currentPage} of ${data.pagination.totalPages}`);
  
  data.data.forEach(product => {
    console.log(`${product.productName} - ₹${product.sellingPrice}`);
  });
}
```

### Example 5: Empty Filter (Get All Products)

```javascript
// Returns all products with default pagination
const response = await fetch('/api/products/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})  // Empty body = no filters
});
```

---

## React/Next.js Integration

### Using React Hook

```typescript
import { useState, useEffect } from 'react';

interface SearchFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  tags?: string[];
  cities?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
}

function useProductSearch(filters: SearchFilters) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/products/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filters)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to search products');
        }

        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [JSON.stringify(filters)]); // Re-run when filters change

  return { data, loading, error };
}

// Usage in component
function ProductSearch() {
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 12
  });

  const { data, loading, error } = useProductSearch(filters);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        {data?.data.map((product: any) => (
          <div key={product.id}>
            <h3>{product.productName}</h3>
            <p>₹{product.sellingPrice}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div>
        <button 
          disabled={!data?.pagination.hasPreviousPage}
          onClick={() => setFilters(f => ({ ...f, page: f.page! - 1 }))}
        >
          Previous
        </button>
        
        <span>Page {data?.pagination.currentPage} of {data?.pagination.totalPages}</span>
        
        <button 
          disabled={!data?.pagination.hasNextPage}
          onClick={() => setFilters(f => ({ ...f, page: f.page! + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## Field Descriptions

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search term for product name and description (case-insensitive, uses LIKE %term%) |
| `minPrice` | number | No | Minimum selling price (inclusive, >= 0) |
| `maxPrice` | number | No | Maximum selling price (inclusive, >= 0) |
| `categories` | array | No | Array of category IDs (number) or names (string). Supports mixed types. |
| `subcategories` | array | No | Array of subcategory IDs (number) or names (string). Supports mixed types. |
| `tags` | array | No | Array of tag IDs or names. Searches within product_tags JSON field. |
| `cities` | array | No | Array of city names or IDs. Searches within locationAvailability JSON field. |
| `page` | number | No | Page number (default: 1, minimum: 1) |
| `limit` | number | No | Items per page (default: 10, minimum: 1, maximum: 100) |
| `sortBy` | string | No | Sort order. Options: `newest` (default), `oldest`, `price_asc`, `price_desc`, `name_asc`, `name_desc` |

### Pagination Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | number | Current page number |
| `totalPages` | number | Total number of pages available |
| `totalItems` | number | Total number of products matching the filters |
| `itemsPerPage` | number | Number of items per page (same as limit) |
| `hasNextPage` | boolean | Whether there is a next page available |
| `hasPreviousPage` | boolean | Whether there is a previous page available |

---

## Sorting Options

| Value | Description |
|-------|-------------|
| `newest` | Sort by ID descending (newest first) - **Default** |
| `oldest` | Sort by ID ascending (oldest first) |
| `price_asc` | Sort by selling price ascending (cheapest first) |
| `price_desc` | Sort by selling price descending (most expensive first) |
| `name_asc` | Sort by product name A-Z |
| `name_desc` | Sort by product name Z-A |

---

## Important Notes

### Filter Behavior
- **Empty arrays/null values are ignored**: If you pass an empty array for `categories` or `null` for `search`, that filter won't be applied.
- **AND logic between different filters**: Products must match ALL applied filters (search AND price range AND categories, etc.)
- **OR logic within same filter**: Within `categories` array, products matching ANY category are included.

### ID vs Name Support
The API supports both numeric IDs and string names for:
- `categories` (uses `category_id` column for numbers, `category` column for strings)
- `subcategories` (uses `subcategory_id` column for numbers, `subcategory` column for strings)
- `tags` (searches within `product_tags` JSON array)
- `cities` (searches within `locationAvailability` JSON array)

### Performance
- Queries are optimized with proper indexing
- Maximum limit is capped at 100 items per page
- Connection pooling is handled automatically
- Empty result sets return immediately without fetching related data

### Error Handling
- Invalid JSON body returns 500 error
- Database connection errors return 500 error
- Validation errors are silently corrected (e.g., page < 1 becomes page = 1)
- Empty results return success with empty data array

---

## Common Use Cases

### 1. Product Listing Page
```javascript
// Show all products with pagination
fetch('/api/products/search', {
  method: 'POST',
  body: JSON.stringify({ page: 1, limit: 24 })
})
```

### 2. Search Bar
```javascript
// Real-time search as user types
fetch('/api/products/search', {
  method: 'POST',
  body: JSON.stringify({ 
    search: searchTerm,
    limit: 10 
  })
})
```

### 3. Filter Sidebar
```javascript
// Multiple filters from UI
fetch('/api/products/search', {
  method: 'POST',
  body: JSON.stringify({
    categories: selectedCategories,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    tags: selectedTags,
    cities: selectedCities,
    sortBy: sortOrder,
    page: currentPage,
    limit: 20
  })
})
```

### 4. Location-Based Products
```javascript
// Show products available in user's city
fetch('/api/products/search', {
  method: 'POST',
  body: JSON.stringify({ 
    cities: [userCity],
    limit: 50 
  })
})
```

---

## Troubleshooting

### No Results Returned
- Check if filters are too restrictive (try removing some filters)
- Verify city/category names match database values exactly
- Ensure price range is valid (minPrice < maxPrice)

### Slow Response
- Reduce `limit` to fetch fewer items per page
- Add database indexes on frequently filtered columns
- Consider caching frequently accessed pages

### Invalid Results
- Verify `product_tags` and `locationAvailability` are stored as valid JSON arrays in database
- Check that category/subcategory IDs exist in database

---

## Security Considerations

- API uses parameterized queries to prevent SQL injection
- Input validation sanitizes all user inputs
- Connection pooling prevents resource exhaustion
- Rate limiting recommended for production (not included in this API)

---

## Version History

**v1.0.0** - Initial release
- Full text search
- Price range filters
- Category/subcategory filters
- Tag filters
- Location availability filters
- Pagination with metadata
- Multiple sort options
- Production-ready error handling
