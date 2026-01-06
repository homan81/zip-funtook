-- Cart Database Schema (Optional - for server-side cart persistence)
-- Currently, cart is managed client-side via localStorage
-- Use this schema if you want to persist cart in database

CREATE TABLE IF NOT EXISTS `cart` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL, -- NULL for guest users, INT for authenticated users
  `session_id` VARCHAR(255) NULL, -- For guest users
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `selected_variants` JSON NULL, -- Store variant selections as JSON
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_session_id` (`session_id`),
  INDEX `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Cart items table (if you want to track cart history)
CREATE TABLE IF NOT EXISTS `cart_items_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `session_id` VARCHAR(255) NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `selected_variants` JSON NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `removed_at` TIMESTAMP NULL,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

