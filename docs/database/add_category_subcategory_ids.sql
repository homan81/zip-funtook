-- Migration: Add category_id and subcategory_id to products table
-- This allows storing category and subcategory as foreign key references instead of string names

-- Add category_id column
ALTER TABLE products 
ADD COLUMN category_id INT NULL AFTER description,
ADD INDEX idx_category_id (category_id);

-- Add subcategory_id column
ALTER TABLE products
ADD COLUMN subcategory_id INT NULL AFTER category_id,
ADD INDEX idx_subcategory_id (subcategory_id);

-- Optional: Add foreign key constraints (recommended for data integrity)
-- Uncomment these lines if you want to enforce referential integrity:

-- ALTER TABLE products
-- ADD CONSTRAINT fk_products_category
-- FOREIGN KEY (category_id) REFERENCES categories(id)
-- ON DELETE SET NULL
-- ON UPDATE CASCADE;

-- ALTER TABLE products
-- ADD CONSTRAINT fk_products_subcategory
-- FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
-- ON DELETE SET NULL
-- ON UPDATE CASCADE;

-- Optional: Migrate existing data from category/subcategory name columns to IDs
-- This script attempts to match category/subcategory names to their IDs

-- Update category_id based on existing category names
UPDATE products p
INNER JOIN categories c ON p.category = c.name
SET p.category_id = c.id
WHERE p.category IS NOT NULL AND p.category != '';

-- Update subcategory_id based on existing subcategory names
UPDATE products p
INNER JOIN subcategories s ON p.subcategory = s.name
SET p.subcategory_id = s.id
WHERE p.subcategory IS NOT NULL AND p.subcategory != '';

-- Optional: After verifying the migration, you can drop the old columns
-- WARNING: Only run these after confirming all data is migrated correctly!

-- ALTER TABLE products DROP COLUMN category;
-- ALTER TABLE products DROP COLUMN subcategory;
