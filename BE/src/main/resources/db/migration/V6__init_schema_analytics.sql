-- V6: Analytics and Forecasting Schema

CREATE TABLE user_events (
    event_id      BIGSERIAL PRIMARY KEY,
    user_id       BIGINT,
    session_id    VARCHAR(100),
    event_type    VARCHAR(30)  NOT NULL,
    product_id    BIGINT,
    variant_id    BIGINT,
    metadata_json TEXT,
    event_time    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_events_type ON user_events (event_type);
CREATE INDEX idx_user_events_time ON user_events (event_time);
CREATE INDEX idx_user_events_product ON user_events (product_id);
CREATE INDEX idx_user_events_user ON user_events (user_id);

CREATE TABLE inventory_movements (
    movement_id    BIGSERIAL PRIMARY KEY,
    variant_id     BIGINT     NOT NULL,
    movement_type  VARCHAR(30) NOT NULL,
    quantity       INT        NOT NULL,
    reference_type VARCHAR(50),
    reference_id   BIGINT,
    created_at     TIMESTAMP  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_movements_variant ON inventory_movements (variant_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements (movement_type);

CREATE TABLE forecast_snapshots (
    snapshot_id              BIGSERIAL PRIMARY KEY,
    variant_id               BIGINT         NOT NULL,
    forecast_date            DATE           NOT NULL,
    lookback_days            INT            NOT NULL,
    predicted_demand         NUMERIC(15, 4) NOT NULL,
    recommended_restock_qty  INT            NOT NULL,
    generated_at             TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forecast_variant_date ON forecast_snapshots (variant_id, forecast_date);

CREATE TABLE sales_summary_daily (
    summary_date     DATE           PRIMARY KEY,
    total_orders     INT            NOT NULL DEFAULT 0,
    total_items_sold INT            NOT NULL DEFAULT 0,
    gross_revenue    NUMERIC(15, 2) NOT NULL DEFAULT 0,
    net_revenue      NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_discount   NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_customers  INT            NOT NULL DEFAULT 0
);
