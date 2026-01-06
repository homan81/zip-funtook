-- Add metadata fields to subcategories table
-- Run this migration to add SEO and image support to subcategories

ALTER TABLE subcategories 
ADD COLUMN image VARCHAR(500) NULL AFTER slug,
ADD COLUMN metaTitle VARCHAR(255) NULL AFTER image,
ADD COLUMN metaKeywords VARCHAR(500) NULL AFTER metaTitle,
ADD COLUMN metaDescription TEXT NULL AFTER metaKeywords,
ADD COLUMN canonicalUrl VARCHAR(1024) NULL AFTER metaDescription,
ADD COLUMN seoSchema TEXT NULL AFTER canonicalUrl;
