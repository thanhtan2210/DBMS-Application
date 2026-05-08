-- V10: Large demo seed data for DBMS reporting and testing

-- Categories: 20 root categories + 80 subcategories = 100 records
WITH root_names AS (
    SELECT root_name
    FROM unnest(ARRAY[
        'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports',
        'Automotive', 'Books', 'Toys', 'Groceries', 'Office',
        'Gaming', 'Outdoor', 'Pet Care', 'Health', 'Furniture',
        'Jewelry', 'Travel', 'Music', 'Baby', 'Industrial'
    ]) AS root_name
), inserted_roots AS (
    INSERT INTO categories (category_name, description, status)
    SELECT root_name, format('Root category for %s demo data', root_name), 'ACTIVE'
    FROM root_names
    ON CONFLICT DO NOTHING
    RETURNING category_id, category_name
)
INSERT INTO categories (parent_category_id, category_name, description, status)
SELECT r.category_id,
       format('%s Subcategory %s', r.category_name, lpad(sub_no::text, 2, '0')),
       format('Subcategory %s under %s', lpad(sub_no::text, 2, '0'), r.category_name),
       'ACTIVE'
FROM inserted_roots r
CROSS JOIN generate_series(1, 4) AS sub_no
ON CONFLICT DO NOTHING;

-- Brands: 100 records
INSERT INTO brands (brand_name, description, status)
SELECT format('Brand %s', lpad(gs::text, 3, '0')),
       format('Demo brand %s for report testing', lpad(gs::text, 3, '0')),
       'ACTIVE'
FROM generate_series(1, 100) AS gs
ON CONFLICT DO NOTHING;

-- Warehouses: 100 records
INSERT INTO warehouses (warehouse_name, location, status)
SELECT format('Warehouse %s', lpad(gs::text, 3, '0')),
       format('%s Logistics Center %s',
              (ARRAY[
                  'Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Hai Phong', 'Can Tho',
                  'Nha Trang', 'Hue', 'Binh Duong', 'Dong Nai', 'Quang Ninh',
                  'Bac Ninh', 'Hai Duong', 'Vinh', 'Thanh Hoa', 'Nghe An',
                  'Lam Dong', 'Binh Thuan', 'An Giang', 'Khanh Hoa', 'Quang Nam'
              ])[1 + ((gs - 1) % 20)],
              lpad(gs::text, 3, '0')),
       'ACTIVE'
FROM generate_series(1, 100) AS gs
ON CONFLICT DO NOTHING;

-- Users: 1 admin, 10 staff, 100 customers = 111 records
INSERT INTO users (email, password_hash, full_name, phone, role, status)
SELECT
    CASE
        WHEN gs = 1 THEN 'admin001@demo.local'
        WHEN gs <= 11 THEN format('staff%s@demo.local', lpad((gs - 1)::text, 3, '0'))
        ELSE format('customer%s@demo.local', lpad((gs - 11)::text, 3, '0'))
    END AS email,
    '$2a$10$LBCEYmXvjWMrlMORfk9zWuU4l3viBLDmLVqhHhNtFi3mWPyuFceXC' AS password_hash,
    CASE
        WHEN gs = 1 THEN 'Admin User'
        WHEN gs <= 11 THEN format('Staff Member %s', lpad((gs - 1)::text, 3, '0'))
        ELSE format('Customer %s', lpad((gs - 11)::text, 3, '0'))
    END AS full_name,
    format('09%s', lpad(gs::text, 8, '0')) AS phone,
    CASE
        WHEN gs = 1 THEN 'ADMIN'
        WHEN gs <= 11 THEN 'STAFF'
        ELSE 'CUSTOMER'
    END AS role,
    'ACTIVE' AS status
FROM generate_series(1, 111) AS gs
ON CONFLICT DO NOTHING;

-- Customer profiles: 100 records
WITH ordered_customers AS (
    SELECT user_id,
           full_name,
           phone,
           row_number() OVER (ORDER BY user_id) AS rn
    FROM users
    WHERE role = 'CUSTOMER' AND email LIKE 'customer%@demo.local'
)
INSERT INTO customer_profiles (user_id, date_of_birth, gender, loyalty_points)
SELECT user_id,
       DATE '1980-01-01' + (((rn * 127) % 9000)::int),
       CASE
           WHEN rn % 3 = 0 THEN 'OTHER'
           WHEN rn % 2 = 0 THEN 'MALE'
           ELSE 'FEMALE'
       END,
       (rn * 17) % 2000
FROM ordered_customers
ON CONFLICT DO NOTHING;

-- Addresses: 120 records
WITH ordered_customers AS (
    SELECT user_id,
           full_name,
           phone,
           row_number() OVER (ORDER BY user_id) AS rn
    FROM users
    WHERE role = 'CUSTOMER' AND email LIKE 'customer%@demo.local'
)
INSERT INTO addresses (
    user_id,
    receiver_name,
    phone,
    street,
    ward,
    district,
    city,
    country,
    postal_code,
    is_default
)
SELECT oc.user_id,
       oc.full_name,
       oc.phone,
       format('%s Demo Street %s', city_choice.city_name, lpad((oc.rn * 10 + addr_no.addr_no)::text, 3, '0')),
       format('Ward %s', lpad(((oc.rn + addr_no.addr_no) % 20 + 1)::text, 2, '0')),
       format('District %s', lpad(((oc.rn + addr_no.addr_no * 3) % 30 + 1)::text, 2, '0')),
       city_choice.city_name,
       'Vietnam',
       format('7%s', lpad(((oc.rn * 11 + addr_no.addr_no) % 90000)::text, 5, '0')),
       addr_no.addr_no = 1
FROM ordered_customers oc
JOIN generate_series(1, 2) AS addr_no(addr_no)
  ON addr_no.addr_no <= CASE WHEN oc.rn <= 20 THEN 2 ELSE 1 END
CROSS JOIN LATERAL (
    SELECT (ARRAY[
        'Ho Chi Minh City', 'Ha Noi', 'Da Nang', 'Hai Phong', 'Can Tho',
        'Nha Trang', 'Hue', 'Binh Duong', 'Dong Nai', 'Quang Ninh'
    ])[1 + ((oc.rn + addr_no.addr_no - 2) % 10)] AS city_name
) AS city_choice
ON CONFLICT DO NOTHING;

UPDATE customer_profiles cp
SET default_shipping_address_id = a.address_id,
    updated_at = NOW()
FROM addresses a
WHERE a.user_id = cp.user_id
  AND a.is_default = TRUE;

-- Products: 120 records
WITH ordered_categories AS (
    SELECT category_id,
           row_number() OVER (ORDER BY category_id) AS rn
    FROM categories
), ordered_brands AS (
    SELECT brand_id,
           row_number() OVER (ORDER BY brand_id) AS rn
    FROM brands
)
INSERT INTO products (sku, product_name, brand_id, category_id, description, price, cost_price, status)
SELECT format('SKU-%s', lpad(gs::text, 4, '0')),
       format('Demo Product %s', lpad(gs::text, 3, '0')),
       b.brand_id,
       c.category_id,
       format('Static catalog item %s for DBMS demo reporting', lpad(gs::text, 3, '0')),
       (15000 + (gs * 791) % 850000)::numeric(15, 2),
       (9000 + (gs * 613) % 700000)::numeric(15, 2),
       'ACTIVE'
FROM generate_series(1, 120) AS gs
JOIN ordered_brands b ON b.rn = 1 + ((gs - 1) % 100)
JOIN ordered_categories c ON c.rn = 1 + ((gs - 1) % 100)
ON CONFLICT DO NOTHING;

-- Product variants: 240 records
WITH ordered_products AS (
    SELECT product_id,
           product_name,
           price,
           row_number() OVER (ORDER BY product_id) AS rn
    FROM products
)
INSERT INTO product_variants (product_id, variant_name, color, size, price_override, barcode, status)
SELECT p.product_id,
       format('%s Variant %s', p.product_name, lpad(variant_no.v_no::text, 2, '0')),
       (ARRAY['Black', 'White', 'Silver', 'Blue', 'Red', 'Green', 'Pink', 'Gold'])[1 + ((p.rn + variant_no.v_no - 2) % 8)],
       (ARRAY['XS', 'S', 'M', 'L', 'XL', '128GB', '256GB', '512GB'])[1 + ((p.rn + variant_no.v_no - 2) % 8)],
       CASE WHEN variant_no.v_no = 1 THEN NULL ELSE (p.price + ((p.rn * variant_no.v_no) % 7000)) END,
       format('BAR-%s-%s', lpad(p.rn::text, 4, '0'), lpad(variant_no.v_no::text, 2, '0')),
       'ACTIVE'
FROM ordered_products p
CROSS JOIN generate_series(1, 2) AS variant_no(v_no)
ON CONFLICT DO NOTHING;

-- Inventory: distributed across warehouses
WITH ordered_variants AS (
    SELECT variant_id,
           row_number() OVER (ORDER BY variant_id) AS rn
    FROM product_variants
), ordered_warehouses AS (
    SELECT warehouse_id,
           row_number() OVER (ORDER BY warehouse_id) AS rn
    FROM warehouses
)
INSERT INTO inventory (variant_id, warehouse_id, quantity_on_hand, quantity_reserved, reorder_threshold)
SELECT ov.variant_id,
       ow.warehouse_id,
       40 + ((ov.rn * ow.rn) % 160),
       (ov.rn + ow.rn) % 12,
       10 + ((ov.rn + ow.rn) % 20)
FROM ordered_variants ov
JOIN ordered_warehouses ow
  ON ow.rn IN (
      1 + ((ov.rn - 1) % 100),
      1 + ((ov.rn + 48) % 100)
  )
ON CONFLICT (variant_id, warehouse_id) DO NOTHING;

-- Promotions: 100 records
INSERT INTO promotions (
    promotion_code,
    promotion_name,
    discount_type,
    discount_value,
    minimum_order_amount,
    max_discount_amount,
    usage_limit,
    used_count,
    start_time,
    end_time,
    status
)
SELECT format('PROMO%s', lpad(gs::text, 3, '0')),
       format('Demo Promotion %s', lpad(gs::text, 3, '0')),
       CASE WHEN gs % 2 = 0 THEN 'PERCENTAGE' ELSE 'FIXED' END,
       CASE
           WHEN gs % 2 = 0 THEN ((gs % 25) + 5)::numeric(15, 2)
           ELSE (15000 + ((gs * 2500) % 150000))::numeric(15, 2)
       END,
       CASE WHEN gs % 3 = 0 THEN 200000::numeric(15, 2) ELSE 100000::numeric(15, 2) END,
       CASE WHEN gs % 2 = 0 THEN 200000::numeric(15, 2) ELSE 150000::numeric(15, 2) END,
       500 + gs,
       (gs * 3) % 50,
       NOW() - ((gs % 15) || ' days')::interval,
       NOW() + ((365 - (gs % 60)) || ' days')::interval,
       CASE WHEN gs % 5 = 0 THEN 'SCHEDULED' ELSE 'ACTIVE' END
FROM generate_series(1, 100) AS gs
ON CONFLICT DO NOTHING;

-- Promotion conditions: 100 records
WITH ordered_promotions AS (
    SELECT promotion_id,
           row_number() OVER (ORDER BY promotion_id) AS rn
    FROM promotions
), ordered_categories AS (
    SELECT category_id,
           row_number() OVER (ORDER BY category_id) AS rn
    FROM categories
), ordered_products AS (
    SELECT product_id,
           row_number() OVER (ORDER BY product_id) AS rn
    FROM products
)
INSERT INTO promotion_conditions (
    promotion_id,
    applicable_category_id,
    applicable_product_id,
    applicable_customer_tier,
    minimum_quantity
)
SELECT p.promotion_id,
       CASE WHEN gs % 2 = 0 THEN c.category_id ELSE NULL END,
       CASE WHEN gs % 2 = 1 THEN pr.product_id ELSE NULL END,
       (ARRAY['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'])[1 + ((gs - 1) % 4)],
       1 + ((gs - 1) % 5)
FROM generate_series(1, 100) AS gs
JOIN ordered_promotions p ON p.rn = gs
JOIN ordered_categories c ON c.rn = 1 + ((gs - 1) % 100)
JOIN ordered_products pr ON pr.rn = 1 + ((gs - 1) % 120)
ON CONFLICT DO NOTHING;

-- Analytics samples for reporting demos
WITH ordered_users AS (
    SELECT user_id,
           row_number() OVER (ORDER BY user_id) AS rn
    FROM users
), ordered_products AS (
    SELECT product_id,
           row_number() OVER (ORDER BY product_id) AS rn
    FROM products
), ordered_variants AS (
    SELECT variant_id,
           row_number() OVER (ORDER BY variant_id) AS rn
    FROM product_variants
)
INSERT INTO user_events (user_id, session_id, event_type, product_id, variant_id, metadata_json, event_time)
SELECT ou.user_id,
       format('sess-%s-%s', lpad(((gs - 1) / 10 + 1)::text, 3, '0'), lpad(((gs - 1) % 10 + 1)::text, 2, '0')),
       (ARRAY['view_product', 'search', 'add_to_cart', 'checkout_start', 'purchase'])[1 + ((gs - 1) % 5)],
       op.product_id,
       ov.variant_id,
       jsonb_build_object(
           'source', 'demo_seed',
           'event_no', gs,
           'channel', CASE WHEN gs % 2 = 0 THEN 'web' ELSE 'mobile' END
       )::text,
       NOW() - ((gs % 60) || ' days')::interval - ((gs % 24) || ' hours')::interval
FROM generate_series(1, 300) AS gs
JOIN ordered_users ou ON ou.rn = 1 + ((gs - 1) % 111)
JOIN ordered_products op ON op.rn = 1 + ((gs - 1) % 120)
JOIN ordered_variants ov ON ov.rn = 1 + ((gs - 1) % 240)
ON CONFLICT DO NOTHING;

WITH ordered_variants AS (
    SELECT variant_id,
           row_number() OVER (ORDER BY variant_id) AS rn
    FROM product_variants
)
INSERT INTO inventory_movements (variant_id, movement_type, quantity, reference_type, reference_id, created_at)
SELECT ov.variant_id,
       (ARRAY['INBOUND', 'OUTBOUND', 'ADJUSTMENT'])[1 + ((gs - 1) % 3)],
       CASE
           WHEN gs % 3 = 1 THEN 10 + (gs % 30)
           WHEN gs % 3 = 2 THEN -1 * (5 + (gs % 15))
           ELSE (gs % 7) - 3
       END,
       (ARRAY['RESTOCK', 'ORDER', 'MANUAL'])[1 + ((gs - 1) % 3)],
       gs,
       NOW() - ((gs % 45) || ' days')::interval
FROM generate_series(1, 240) AS gs
JOIN ordered_variants ov ON ov.rn = 1 + ((gs - 1) % 240)
ON CONFLICT DO NOTHING;

WITH ordered_variants AS (
    SELECT variant_id,
           row_number() OVER (ORDER BY variant_id) AS rn
    FROM product_variants
)
INSERT INTO forecast_snapshots (
    variant_id,
    forecast_date,
    lookback_days,
    predicted_demand,
    recommended_restock_qty,
    generated_at
)
SELECT ov.variant_id,
       CURRENT_DATE + ((gs % 30) + 1),
       30 + (gs % 60),
       ((5000 + ((gs * 31) % 2500)) / 100.0)::numeric(15, 4),
       5 + (gs % 25),
       NOW() - ((gs % 10) || ' days')::interval
FROM generate_series(1, 120) AS gs
JOIN ordered_variants ov ON ov.rn = 1 + ((gs - 1) % 240)
ON CONFLICT DO NOTHING;

INSERT INTO sales_summary_daily (
    summary_date,
    total_orders,
    total_items_sold,
    gross_revenue,
    net_revenue,
    total_discount,
    total_customers
)
SELECT CURRENT_DATE - (gs - 1),
       20 + (gs % 70),
       40 + (gs % 180),
       ((1500000 + (gs * 27500)) / 100.0)::numeric(15, 2),
       ((1300000 + (gs * 24000)) / 100.0)::numeric(15, 2),
       ((200000 + (gs * 3200)) / 100.0)::numeric(15, 2),
       10 + (gs % 40)
FROM generate_series(1, 90) AS gs
ON CONFLICT DO NOTHING;