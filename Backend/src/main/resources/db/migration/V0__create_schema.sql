-- V0: Create base schema (PostgreSQL)
-- Enums stored as VARCHAR to match @Enumerated(EnumType.STRING)

-- 1. User table
CREATE TABLE IF NOT EXISTS _user (
                                     id          BIGSERIAL       PRIMARY KEY,
                                     first_name  VARCHAR(255),
    last_name   VARCHAR(255),
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(50)     NOT NULL      -- Role: USER, ADMIN
    );

-- 2. Category table
--    user_id nullable for global categories (is_global = true)
CREATE TABLE IF NOT EXISTS category (
                                        id          BIGSERIAL       PRIMARY KEY,
                                        name        VARCHAR(255)    NOT NULL,
    icon        VARCHAR(255),
    color       VARCHAR(100),
    type        VARCHAR(50)     NOT NULL,     -- TransactionType: INCOME, EXPENSE
    user_id     BIGINT,
    is_deleted  BOOLEAN         NOT NULL DEFAULT FALSE,
    is_global   BOOLEAN         NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_category_user
    FOREIGN KEY (user_id)
    REFERENCES _user (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
    );

-- Optional: enforce relationship between is_global and user_id
-- Uncomment if you want strict invariants at DB level
-- ALTER TABLE category
-- ADD CONSTRAINT chk_category_global_user
-- CHECK (
--     (is_global = TRUE  AND user_id IS NULL)
--  OR (is_global = FALSE AND user_id IS NOT NULL)
-- );

-- 3. UserSettings table
--    PK = FK to _user.id via @MapsId
CREATE TABLE IF NOT EXISTS user_settings (
                                             user_id     BIGINT          PRIMARY KEY,
                                             theme       VARCHAR(50)     NOT NULL DEFAULT 'light',
    currency    VARCHAR(3)      NOT NULL DEFAULT 'EUR',
    language    VARCHAR(2)      NOT NULL DEFAULT 'en',
    is_rtl      BOOLEAN         NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user_settings_user
    FOREIGN KEY (user_id)
    REFERENCES _user (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
    );

-- 4. Transaction table
CREATE TABLE IF NOT EXISTS transaction (
                                           id          BIGSERIAL       PRIMARY KEY,
                                           date        TIMESTAMPTZ,
                                           description VARCHAR(255),
    amount      NUMERIC(19,4)   NOT NULL,
    type        VARCHAR(50)     NOT NULL,     -- TransactionType: INCOME, EXPENSE
    currency    VARCHAR(3)      NOT NULL DEFAULT 'USD',
    user_id     BIGINT,
    category_id BIGINT,
    CONSTRAINT fk_transaction_user
    FOREIGN KEY (user_id)
    REFERENCES _user (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    CONSTRAINT fk_transaction_category
    FOREIGN KEY (category_id)
    REFERENCES category (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
    );