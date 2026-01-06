# Migration Guide: Category and Subcategory IDs

## Overview
The products table now stores `category_id` and `subcategory_id` (integers) instead of category/subcategory names (strings). This provides better data integrity and enables faster queries with proper indexing.

## Database Migration

### Step 1: Run SQL Migration
Execute the SQL script to add the new columns and migrate existing data:

```bash
# Connect to your MySQL database and run:
mysql -u your_username -p your_database_name < database/add_category_subcategory_ids.sql
```

Or manually execute the SQL file: `database/add_category_subcategory_ids.sql`

### What the Migration Does:
1. Adds `category_id` INT column with index
2. Adds `subcategory_id` INT column with index
3. Migrates existing data from category/subcategory name columns to IDs
4. Optionally adds foreign key constraints (commented out by default)

### Step 2: Verify Migration
Check that category_id and subcategory_id are populated:

```sql
SELECT id, productName, category, category_id, subcategory, subcategory_id 
FROM products 
LIMIT 10;
```

## Code Changes Made

### 1. Frontend Forms

#### Add/New Product Form (`app/admin/products/new/page.tsx`)
- ✅ Schema updated to use `category_id` and `subcategory_id` (numbers)
- ✅ Default values changed from empty strings to `0`
- ✅ Form submission sends IDs instead of names

#### Edit Product Form (`app/admin/products/edit/[id]/page.tsx`)
- ✅ Schema updated to use `category_id` and `subcategory_id`
- ✅ Form loading reads IDs from product data
- ✅ Form submission sends IDs

#### CategorySelector Component (`app/components/admin/components/CategorySelector/cat.tsx`)
- ✅ Sets `category_id` and `subcategory_id` in form instead of names
- ✅ Subcategory dropdown uses ID values instead of names
- ✅ Error handling updated to show `category_id` errors

### 2. Backend APIs

#### Create Product API (`app/api/products/route.ts` - POST)
- ✅ Reads `category_id` and `subcategory_id` from FormData
- ✅ Saves IDs to database (with column detection)
- ✅ Old category/subcategory name columns removed from insert

#### Update Product API (`app/api/products/[id]/route.ts` - PUT)
- ✅ Reads `category_id` and `subcategory_id` from FormData
- ✅ Updates IDs in database (with column detection)
- ✅ Old category/subcategory name columns removed from update

#### Search API (`app/api/products/search/route.ts` - POST)
- ✅ Filters now use `category_id` and `subcategory_id` columns
- ✅ Converts filter values to numbers for proper comparison
- ✅ Supports numeric ID arrays: `{ "categories": [1, 2, 3] }`

#### Get Product API (`app/api/products/[id]/route.ts` - GET)
- ✅ No changes needed - already returns all columns including new IDs

## Testing Checklist

### 1. Create New Product
- [ ] Select a category - verify ID is sent
- [ ] Select a subcategory - verify ID is sent
- [ ] Submit form - check database for category_id and subcategory_id values
- [ ] Verify product appears in admin list

### 2. Edit Existing Product
- [ ] Load product - verify category and subcategory are pre-selected
- [ ] Change category - verify new ID is sent
- [ ] Change subcategory - verify new ID is sent
- [ ] Submit form - check database for updated IDs

### 3. Search API
Test with different filter combinations:

```javascript
// Test 1: Single category
POST /api/products/search
{
  "categories": [1]
}

// Test 2: Multiple categories
POST /api/products/search
{
  "categories": [1, 2, 3]
}

// Test 3: With subcategories
POST /api/products/search
{
  "categories": [1],
  "subcategories": [5, 6]
}

// Test 4: Combined filters
POST /api/products/search
{
  "categories": [1],
  "minPrice": 100,
  "maxPrice": 500,
  "search": "balloon",
  "page": 1,
  "limit": 20
}
```

### 4. Verify Old Data
- [ ] Check products created before migration still display correctly
- [ ] Verify category and subcategory IDs were migrated properly

## Rollback Plan

If you need to rollback:

1. **Keep old columns**: The migration doesn't drop `category` and `subcategory` columns by default
2. **Revert code changes**: Use git to revert to previous commit
3. **Optional**: Drop new columns:
   ```sql
   ALTER TABLE products 
   DROP INDEX idx_category_id,
   DROP INDEX idx_subcategory_id,
   DROP COLUMN category_id,
   DROP COLUMN subcategory_id;
   ```

## Benefits of This Change

1. **Data Integrity**: Foreign key constraints prevent invalid category/subcategory references
2. **Performance**: Integer comparisons are faster than string comparisons
3. **Consistency**: IDs never change, even if category names are updated
4. **Storage**: Integers use less space than VARCHAR strings
5. **Easier Joins**: Can easily join with categories/subcategories tables

## Breaking Changes

⚠️ **API Changes**: 
- Frontend must now send `category_id` and `subcategory_id` instead of `category` and `subcategory`
- Search API expects numeric category/subcategory IDs instead of names
- Any external integrations using the old field names will break

## Migration Status

✅ **Completed**:
- Database schema migration script created
- Frontend forms updated (add and edit)
- Backend APIs updated (POST, PUT, search)
- CategorySelector component updated

⚠️ **Pending**:
- Run SQL migration on production database
- Test all functionality
- Update any external integrations or API documentation

## Support

If you encounter issues:
1. Check database logs for constraint violations
2. Verify category_id values exist in categories table
3. Verify subcategory_id values exist in subcategories table
4. Check browser console for form submission errors
5. Check server logs for API errors
