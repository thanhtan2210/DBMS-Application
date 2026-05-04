-- V2: Product and Catalog Schema

CREATE TABLE categories (
    category_id       BIGSERIAL PRIMARY KEY,
    parent_category_id BIGINT REFERENCES categories (category_id),
    category_name     VARCHAR(255) NOT NULL,
    description       TEXT,
    status            VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE brands (
    brand_id    BIGSERIAL PRIMARY KEY,
    brand_name  VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE products (
    product_id   BIGSERIAL PRIMARY KEY,
    sku          VARCHAR(100) NOT NULL UNIQUE,
    product_name VARCHAR(500) NOT NULL,
    brand_id     BIGINT REFERENCES brands (brand_id),
    category_id  BIGINT REFERENCES categories (category_id),
    description  TEXT,
    price        NUMERIC(15, 2) NOT NULL,
    cost_price   NUMERIC(15, 2),
    status       VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMP
);

CREATE INDEX idx_products_sku ON products (sku);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_brand ON products (brand_id);

CREATE TABLE product_variants (
    variant_id    BIGSERIAL PRIMARY KEY,
    product_id    BIGINT       NOT NULL REFERENCES products (product_id),
    variant_name  VARCHAR(255) NOT NULL,
    color         VARCHAR(100),
    size          VARCHAR(50),
    price_override NUMERIC(15, 2),
    barcode       VARCHAR(100) UNIQUE,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
);

CREATE INDEX idx_variants_barcode ON product_variants (barcode);
CREATE INDEX idx_variants_product ON product_variants (product_id);

CREATE TABLE warehouses (
    warehouse_id   BIGSERIAL PRIMARY KEY,
    warehouse_name VARCHAR(255) NOT NULL,
    location       VARCHAR(500),
    status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE inventory (
    inventory_id       BIGSERIAL PRIMARY KEY,
    variant_id         BIGINT NOT NULL REFERENCES product_variants (variant_id),
    warehouse_id       BIGINT NOT NULL REFERENCES warehouses (warehouse_id),
    quantity_on_hand   INT    NOT NULL DEFAULT 0,
    quantity_reserved  INT    NOT NULL DEFAULT 0,
    reorder_threshold  INT    NOT NULL DEFAULT 0,
    updated_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uc_inventory_variant_warehouse UNIQUE (variant_id, warehouse_id)
);

CREATE INDEX idx_inventory_variant ON inventory (variant_id);
