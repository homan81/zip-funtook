-- Migration: Add SEO metadata fields to categories table

-- Add metadata columns
ALTER TABLE categories 
ADD COLUMN metaTitle VARCHAR(255) NULL AFTER slug,
ADD COLUMN metaKeywords VARCHAR(500) NULL AFTER metaTitle,
ADD COLUMN metaDescription TEXT NULL AFTER metaKeywords,
ADD COLUMN canonicalUrl VARCHAR(1024) NULL AFTER metaDescription,
ADD COLUMN seoSchema TEXT NULL AFTER canonicalUrl;
ALTER TABLE categories
ADD INDEX idx_metaTitle (metaTitle);

-- Optional: You can also add timestamps if not already present
-- ALTER TABLE categories
-- ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER canonicalUrl,
-- ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
