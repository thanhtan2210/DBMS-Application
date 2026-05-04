-- V5: Promotion Schema

CREATE TABLE promotions (
    promotion_id          BIGSERIAL PRIMARY KEY,
    promotion_code        VARCHAR(100)   NOT NULL UNIQUE,
    promotion_name        VARCHAR(255)   NOT NULL,
    discount_type         VARCHAR(20)    NOT NULL,
    discount_value        NUMERIC(15, 2) NOT NULL,
    minimum_order_amount  NUMERIC(15, 2),
    max_discount_amount   NUMERIC(15, 2),
    usage_limit           INT,
    used_count            INT            NOT NULL DEFAULT 0,
    start_time            TIMESTAMP      NOT NULL,
    end_time              TIMESTAMP      NOT NULL,
    status                VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    created_at            TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_code ON promotions (promotion_code);
CREATE INDEX idx_promotions_status_time ON promotions (status, start_time, end_time);

CREATE TABLE promotion_conditions (
    condition_id               BIGSERIAL PRIMARY KEY,
    promotion_id               BIGINT NOT NULL REFERENCES promotions (promotion_id),
    applicable_category_id     BIGINT,
    applicable_product_id      BIGINT,
    applicable_customer_tier   VARCHAR(50),
    minimum_quantity           INT
);

CREATE TABLE order_promotions (
    order_promotion_id BIGSERIAL PRIMARY KEY,
    order_id           BIGINT         NOT NULL REFERENCES orders (order_id),
    promotion_id       BIGINT         NOT NULL REFERENCES promotions (promotion_id),
    discount_amount    NUMERIC(15, 2) NOT NULL
);
