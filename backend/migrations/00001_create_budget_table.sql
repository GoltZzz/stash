-- +goose Up
CREATE TABLE IF NOT EXISTS budgets(
    id UUID PRIMARY KEY,
    amount NUMERIC(12,2) NOT NULL,
    currency CHAR(3) DEFAULT 'PHP' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- +goose Down
DROP TABLE budgets;
