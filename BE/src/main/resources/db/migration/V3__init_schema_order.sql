-- V3: Cart and Order Schema

CREATE TABLE carts (
    cart_id     BIGSERIAL PRIMARY KEY,
    customer_id BIGINT    NOT NULL REFERENCES customer_profiles (customer_id),
    status      VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_carts_customer_status ON carts (customer_id, status);

CREATE TABLE cart_items (
    cart_item_id  BIGSERIAL PRIMARY KEY,
    cart_id       BIGINT         NOT NULL REFERENCES carts (cart_id),
    variant_id    BIGINT         NOT NULL REFERENCES product_variants (variant_id),
    quantity      INT            NOT NULL,
    unit_price    NUMERIC(15, 2) NOT NULL,
    selected_flag BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
    order_id            BIGSERIAL PRIMARY KEY,
    customer_id         BIGINT         NOT NULL REFERENCES customer_profiles (customer_id),
    order_code          VARCHAR(50)    NOT NULL UNIQUE,
    shipping_address_id BIGINT         NOT NULL REFERENCES addresses (address_id),
    order_status        VARCHAR(30)    NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_status      VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    subtotal_amount     NUMERIC(15, 2) NOT NULL,
    discount_amount     NUMERIC(15, 2) NOT NULL DEFAULT 0,
    shipping_fee        NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tax_amount          NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_amount        NUMERIC(15, 2) NOT NULL,
    created_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_order_code ON orders (order_code);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_order_status ON orders (order_status);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);
CREATE INDEX idx_orders_created_at ON orders (created_at);

CREATE TABLE order_items (
    order_item_id  BIGSERIAL PRIMARY KEY,
    order_id       BIGINT         NOT NULL REFERENCES orders (order_id),
    variant_id     BIGINT         NOT NULL REFERENCES product_variants (variant_id),
    quantity       INT            NOT NULL,
    unit_price     NUMERIC(15, 2) NOT NULL,
    discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    line_total     NUMERIC(15, 2) NOT NULL
);

CREATE TABLE order_status_history (
    history_id  BIGSERIAL PRIMARY KEY,
    order_id    BIGINT      NOT NULL REFERENCES orders (order_id),
    old_status  VARCHAR(30),
    new_status  VARCHAR(30) NOT NULL,
    changed_by  VARCHAR(255),
    changed_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    note        TEXT
);

CREATE INDEX idx_order_history_order ON order_status_history (order_id);
