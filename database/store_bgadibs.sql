
-- =========================================================
-- FASHION E-COMMERCE DATABASE
-- Database: store_bgadibs
-- MySQL: 8.0.46
-- =========================================================

CREATE DATABASE IF NOT EXISTS `store_bgadibs`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE `store_bgadibs`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- DROP EXISTING TABLES
-- =========================================================

DROP TABLE IF EXISTS `customer_settings`;
DROP TABLE IF EXISTS `admin_settings`;
DROP TABLE IF EXISTS `wishlist`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
    `email` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
    `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `role` enum('customer','admin','superadmin')
        COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'customer',
    `status` enum('active','inactive')
        COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- Existing users
INSERT INTO `users`
(`id`, `name`, `email`, `phone`, `password`, `role`, `status`,
 `created_at`, `updated_at`)
VALUES
(
    1,
    'Super Admin',
    'superadmin@fashionstore',
    NULL,
    '$2b$10$3x.vmG7RmYH4Iqd0HMX2IOSOprIhHUbJpJkGieQlDH7tutAdcJZhm',
    'superadmin',
    'active',
    '2026-10-01 15:14:19',
    '2026-10-03 11:38:33'
),
(
    2,
    'Aswini',
    'pulivarthiaswini123@gmail.com',
    NULL,
    '$2b$10$.2yPqUAibdzbuT/ZCy9.dOCUEyA5CYOBeFJxP6IQ5khRFqR5Ci.',
    'customer',
    'active',
    '2026-10-02 16:56:11',
    '2026-10-02 16:56:11'
),
(
    3,
    'Admin1',
    'admin1234@gmail.com',
    '8639332685',
    '$2b$10$xRi/bOJeO5FKTWo670uj8u6AXGj6I8Zp8FqEK/BUKMIhLx2vt77w2',
    'admin',
    'active',
    '2026-10-05 04:05:32',
    '2026-10-05 04:05:32'
);

-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE `categories` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
    `slug` varchar(140) COLLATE utf8mb4_general_ci NOT NULL,
    `parent_id` int DEFAULT NULL,
    `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `sort_order` int NOT NULL DEFAULT '0',
    `status` enum('active','inactive')
        COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_category_slug` (`slug`),
    KEY `fk_cat_parent` (`parent_id`),

    CONSTRAINT `fk_category_parent`
        FOREIGN KEY (`parent_id`)
        REFERENCES `categories` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

INSERT INTO `categories`
(`id`, `name`, `slug`, `parent_id`, `image`, `sort_order`,
 `status`, `created_at`)
VALUES
(1, 'Women', 'women', NULL, NULL, 1, 'active', '2026-10-01 15:14:19'),
(2, 'Men', 'men', NULL, NULL, 2, 'active', '2026-10-01 15:14:19'),
(3, 'Kids', 'kids', NULL, NULL, 3, 'active', '2026-10-01 15:14:19'),
(4, 'Dresses', 'women-dresses', 1, NULL, 1, 'active', '2026-10-01 15:14:19'),
(5, 'Tops', 'women-tops', 1, NULL, 2, 'active', '2026-10-01 15:14:19'),
(6, 'Shirts', 'men-shirts', 2, NULL, 1, 'active', '2026-10-01 15:14:19'),
(7, 'T-Shirts', 'men-tshirts', 2, NULL, 2, 'active', '2026-10-01 15:14:19'),
(8, 'Boys', 'kids-boys', 3, NULL, 1, 'active', '2026-10-01 15:14:19'),
(9, 'Girls', 'kids-girls', 3, NULL, 2, 'active', '2026-10-01 15:14:19');

-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE `products` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
    `slug` varchar(220) COLLATE utf8mb4_general_ci NOT NULL,
    `description` text COLLATE utf8mb4_general_ci,
    `category_id` int DEFAULT NULL,
    `brand` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `sku` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `base_price` decimal(10,2) NOT NULL DEFAULT '0.00',
    `sale_price` decimal(10,2) DEFAULT NULL,
    `featured` tinyint(1) NOT NULL DEFAULT '0',
    `status` enum('draft','active','archived')
        COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'draft',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_product_slug` (`slug`),
    KEY `fk_prod_cat` (`category_id`),
    KEY `idx_prod_status` (`status`),
    KEY `idx_prod_featured` (`featured`),

    CONSTRAINT `fk_product_category`
        FOREIGN KEY (`category_id`)
        REFERENCES `categories` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- PRODUCT VARIANTS
-- =========================================================

CREATE TABLE `product_variants` (
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` int NOT NULL,
    `size` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `color` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `sku` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `price_override` decimal(10,2) DEFAULT NULL,
    `stock_quantity` int NOT NULL DEFAULT '0',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `idx_var_prod` (`product_id`),

    CONSTRAINT `fk_product_variants_product`
        FOREIGN KEY (`product_id`)
        REFERENCES `products` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================

CREATE TABLE `product_images` (
    `id` int NOT NULL AUTO_INCREMENT,
    `product_id` int NOT NULL,
    `image_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
    `is_primary` tinyint(1) NOT NULL DEFAULT '0',
    `sort_order` int NOT NULL DEFAULT '0',

    PRIMARY KEY (`id`),
    KEY `idx_img_prod` (`product_id`),

    CONSTRAINT `fk_product_images_product`
        FOREIGN KEY (`product_id`)
        REFERENCES `products` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ADDRESSES
-- =========================================================

CREATE TABLE `addresses` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `full_name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
    `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
    `line1` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
    `line2` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
    `state` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
    `postal_code` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
    `country` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'India',
    `is_default` tinyint(1) NOT NULL DEFAULT '0',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `fk_addr_user` (`user_id`),

    CONSTRAINT `fk_address_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- CART ITEMS
-- =========================================================

CREATE TABLE `cart_items` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `product_variant_id` int NOT NULL,
    `quantity` int NOT NULL DEFAULT '1',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_cart_line` (`user_id`, `product_variant_id`),
    KEY `fk_cart_var` (`product_variant_id`),

    CONSTRAINT `fk_cart_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_cart_variant`
        FOREIGN KEY (`product_variant_id`)
        REFERENCES `product_variants` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE `orders` (
    `id` int NOT NULL AUTO_INCREMENT,
    `order_number` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
    `user_id` int DEFAULT NULL,
    `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
    `shipping` decimal(10,2) NOT NULL DEFAULT '0.00',
    `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
    `total` decimal(10,2) NOT NULL DEFAULT '0.00',
    `status` enum(
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    ) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
    `payment_method` varchar(40) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'cod',
    `payment_status` enum(
        'unpaid',
        'paid',
        'refunded'
    ) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'unpaid',
    `ship_full_name` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_line1` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_line2` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_state` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_postal` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `ship_country` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_order_number` (`order_number`),
    KEY `fk_order_user` (`user_id`),
    KEY `idx_order_status` (`status`),

    CONSTRAINT `fk_order_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ORDER ITEMS
-- =========================================================

CREATE TABLE `order_items` (
    `id` int NOT NULL AUTO_INCREMENT,
    `order_id` int NOT NULL,
    `product_variant_id` int DEFAULT NULL,
    `product_name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
    `size` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `color` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `unit_price` decimal(10,2) NOT NULL,
    `quantity` int NOT NULL,
    `line_total` decimal(10,2) NOT NULL,

    PRIMARY KEY (`id`),
    KEY `idx_oi_order` (`order_id`),
    KEY `fk_oi_var` (`product_variant_id`),

    CONSTRAINT `fk_order_item_order`
        FOREIGN KEY (`order_id`)
        REFERENCES `orders` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_order_item_variant`
        FOREIGN KEY (`product_variant_id`)
        REFERENCES `product_variants` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- PASSWORD RESETS
-- =========================================================

CREATE TABLE `password_resets` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
    `token` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
    `expires_at` datetime NOT NULL,
    `used` tinyint(1) NOT NULL DEFAULT '0',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `idx_token` (`token`),
    KEY `idx_email` (`email`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- WISHLIST
-- =========================================================

CREATE TABLE `wishlist` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `product_id` int NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_wish` (`user_id`, `product_id`),
    KEY `fk_wish_prod` (`product_id`),
    KEY `fk_wish_user` (`user_id`),

    CONSTRAINT `fk_wishlist_product`
        FOREIGN KEY (`product_id`)
        REFERENCES `products` (`id`)
        ON DELETE CASCADE,

    CONSTRAINT `fk_wishlist_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- ADMIN SETTINGS
-- =========================================================

CREATE TABLE `admin_settings` (
    `id` int NOT NULL AUTO_INCREMENT,

    `store_name`
        varchar(150)
        COLLATE utf8mb4_general_ci
        NOT NULL DEFAULT 'Bgadi Fashion',

    `store_email`
        varchar(150)
        COLLATE utf8mb4_general_ci
        DEFAULT NULL,

    `store_phone`
        varchar(30)
        COLLATE utf8mb4_general_ci
        DEFAULT NULL,

    `store_address`
        text
        COLLATE utf8mb4_general_ci,

    `currency`
        varchar(10)
        COLLATE utf8mb4_general_ci
        NOT NULL DEFAULT 'INR',

    `shipping_threshold`
        decimal(10,2)
        NOT NULL DEFAULT '999.00',

    `new_order_notification`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `low_stock_notification`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `customer_registration_notification`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `allow_order_cancellation`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `created_at`
        timestamp
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    `updated_at`
        timestamp
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- CUSTOMER SETTINGS
-- =========================================================

CREATE TABLE `customer_settings` (
    `id` int NOT NULL AUTO_INCREMENT,

    `user_id`
        int NOT NULL,

    `order_notifications`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `delivery_notifications`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `promotional_notifications`
        tinyint(1)
        NOT NULL DEFAULT '0',

    `profile_visibility`
        tinyint(1)
        NOT NULL DEFAULT '1',

    `created_at`
        timestamp
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    `updated_at`
        timestamp
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),

    UNIQUE KEY `unique_customer_settings_user`
        (`user_id`),

    CONSTRAINT `fk_customer_settings_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

-- =========================================================
-- FINISH
-- =========================================================

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- TABLES INCLUDED
-- =========================================================
-- 1. users
-- 2. categories
-- 3. products
-- 4. product_variants
-- 5. product_images
-- 6. addresses
-- 7. cart_items
-- 8. orders
-- 9. order_items
-- 10. password_resets
-- 11. wishlist
-- 12. admin_settings
-- 13. customer_settings
-- =========================================================

