-- V7: Seed Data for Development and Demo

-- Categories
INSERT INTO categories (category_name, description, status) VALUES
    ('Electronics', 'Electronic devices and accessories', 'ACTIVE'),
    ('Fashion', 'Clothing, shoes and accessories', 'ACTIVE'),
    ('Home & Living', 'Furniture and home decor', 'ACTIVE');

INSERT INTO categories (parent_category_id, category_name, description, status)
SELECT c.category_id, 'Smartphones', 'Mobile phones', 'ACTIVE' FROM categories c WHERE c.category_name = 'Electronics'
UNION ALL
SELECT c.category_id, 'Laptops', 'Notebook computers', 'ACTIVE' FROM categories c WHERE c.category_name = 'Electronics'
UNION ALL
SELECT c.category_id, 'Men Clothing', 'Men fashion', 'ACTIVE' FROM categories c WHERE c.category_name = 'Fashion';

-- Brands
INSERT INTO brands (brand_name, description, status) VALUES
    ('Apple', 'Apple Inc.', 'ACTIVE'),
    ('Samsung', 'Samsung Electronics', 'ACTIVE'),
    ('Nike', 'Nike sportswear', 'ACTIVE'),
    ('Dell', 'Dell Technologies', 'ACTIVE');

-- Users (admin + sample customers)
INSERT INTO users (email, password_hash, full_name, phone, role, status) VALUES
    ('admin@shop.com', '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC', 'Admin User', '0901234567', 'ADMIN', 'ACTIVE'),
    ('alice@email.com', '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC', 'Alice Nguyen', '0912345678', 'CUSTOMER', 'ACTIVE'),
    ('bob@email.com', '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC', 'Bob Tran', '0923456789', 'CUSTOMER', 'ACTIVE'),
    ('carol@email.com', '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC', 'Carol Le', '0934567890', 'CUSTOMER', 'ACTIVE'),
    ('staff1@shop.com', '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC', 'Warehouse Staff 1', '0945678901', 'STAFF', 'ACTIVE');

-- Addresses
INSERT INTO addresses (user_id, receiver_name, phone, street, ward, district, city, country, is_default)
SELECT u.user_id, u.full_name, u.phone,
       '123 Nguyen Hue', 'Ben Nghe', 'District 1', 'Ho Chi Minh City', 'Vietnam', TRUE
FROM users u WHERE u.email = 'alice@email.com'
UNION ALL
SELECT u.user_id, u.full_name, u.phone,
       '456 Tran Phu', 'Hai Chau', 'Hai Chau', 'Da Nang', 'Vietnam', TRUE
FROM users u WHERE u.email = 'bob@email.com'
UNION ALL
SELECT u.user_id, u.full_name, u.phone,
       '789 Ly Thai To', 'Hoan Kiem', 'Hoan Kiem', 'Ha Noi', 'Vietnam', TRUE
FROM users u WHERE u.email = 'carol@email.com';

-- Customer Profiles
INSERT INTO customer_profiles (user_id, gender, loyalty_points)
SELECT u.user_id, 'FEMALE', 100 FROM users u WHERE u.email = 'alice@email.com'
UNION ALL
SELECT u.user_id, 'MALE', 50 FROM users u WHERE u.email = 'bob@email.com'
UNION ALL
SELECT u.user_id, 'FEMALE', 200 FROM users u WHERE u.email = 'carol@email.com';

-- Update default_shipping_address_id
UPDATE customer_profiles cp
SET default_shipping_address_id = (
    SELECT a.address_id FROM addresses a WHERE a.user_id = cp.user_id AND a.is_default = TRUE LIMIT 1
);

-- Warehouses
INSERT INTO warehouses (warehouse_name, location, status) VALUES
    ('HCM Main Warehouse', 'Tan Binh, Ho Chi Minh City', 'ACTIVE'),
    ('HN Main Warehouse', 'Long Bien, Ha Noi', 'ACTIVE');

-- Products (Smartphones)
INSERT INTO products (sku, product_name, brand_id, category_id, description, price, cost_price, status)
SELECT 'APPLE-IP15-PRO', 'iPhone 15 Pro', b.brand_id, c.category_id,
       'Apple iPhone 15 Pro 256GB', 29000000, 22000000, 'ACTIVE'
FROM brands b, categories c WHERE b.brand_name = 'Apple' AND c.category_name = 'Smartphones'
UNION ALL
SELECT 'SAMSUNG-S24', 'Samsung Galaxy S24', b.brand_id, c.category_id,
       'Samsung Galaxy S24 Ultra 512GB', 25000000, 19000000, 'ACTIVE'
FROM brands b, categories c WHERE b.brand_name = 'Samsung' AND c.category_name = 'Smartphones';

-- Product Variants
INSERT INTO product_variants (product_id, variant_name, color, price_override, barcode, status)
SELECT p.product_id, 'Natural Titanium 256GB', 'Natural Titanium', NULL::numeric, 'BARCODE-IP15-NT-256', 'ACTIVE'
FROM products p WHERE p.sku = 'APPLE-IP15-PRO'
UNION ALL
SELECT p.product_id, 'Black Titanium 256GB', 'Black Titanium', NULL::numeric, 'BARCODE-IP15-BT-256', 'ACTIVE'
FROM products p WHERE p.sku = 'APPLE-IP15-PRO'
UNION ALL
SELECT p.product_id, 'Cobalt Violet 512GB', 'Cobalt Violet', NULL::numeric, 'BARCODE-S24-CV-512', 'ACTIVE'
FROM products p WHERE p.sku = 'SAMSUNG-S24';

-- Inventory (assign stock to HCM warehouse)
INSERT INTO inventory (variant_id, warehouse_id, quantity_on_hand, quantity_reserved, reorder_threshold)
SELECT pv.variant_id, w.warehouse_id, 50, 0, 5
FROM product_variants pv, warehouses w WHERE w.warehouse_name = 'HCM Main Warehouse';

-- Promotions
INSERT INTO promotions (promotion_code, promotion_name, discount_type, discount_value,
                        minimum_order_amount, max_discount_amount, usage_limit,
                        start_time, end_time, status)
VALUES
    ('WELCOME10', 'Welcome 10% Off', 'PERCENTAGE', 10, 100000, 500000, 1000,
     NOW(), NOW() + INTERVAL '365 days', 'ACTIVE'),
    ('FLASH200K', 'Flash Sale 200K Off', 'FIXED', 200000, 500000, 200000, 500,
     NOW(), NOW() + INTERVAL '30 days', 'ACTIVE');
