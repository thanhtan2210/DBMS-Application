-- V1: User and Customer Schema

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    user_id       BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    role          VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_created_at ON users (created_at);

CREATE TABLE customer_profiles (
    customer_id                  BIGSERIAL PRIMARY KEY,
    user_id                      BIGINT NOT NULL UNIQUE REFERENCES users (user_id),
    date_of_birth                DATE,
    gender                       VARCHAR(10),
    loyalty_points               INT       NOT NULL DEFAULT 0,
    default_shipping_address_id  BIGINT,
    created_at                   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at                   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
    address_id    BIGSERIAL PRIMARY KEY,
    user_id       BIGINT       NOT NULL REFERENCES users (user_id),
    receiver_name VARCHAR(255) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    street        VARCHAR(500) NOT NULL,
    ward          VARCHAR(100),
    district      VARCHAR(100),
    city          VARCHAR(100) NOT NULL,
    country       VARCHAR(100) NOT NULL DEFAULT 'Vietnam',
    postal_code   VARCHAR(20),
    is_default    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
