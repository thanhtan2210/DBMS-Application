-- V4: Payment Schema

CREATE TABLE payments (
    payment_id       BIGSERIAL PRIMARY KEY,
    order_id         BIGINT         NOT NULL REFERENCES orders (order_id),
    payment_method   VARCHAR(30)    NOT NULL,
    payment_provider VARCHAR(100),
    transaction_ref  VARCHAR(255)   UNIQUE,
    amount           NUMERIC(15, 2) NOT NULL,
    payment_status   VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    paid_at          TIMESTAMP,
    raw_response     TEXT,
    created_at       TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_transaction_ref ON payments (transaction_ref);
CREATE INDEX idx_payments_payment_status ON payments (payment_status);
CREATE INDEX idx_payments_order ON payments (order_id);
