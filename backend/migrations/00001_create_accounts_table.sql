-- +goose Up
CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(25) NOT NULL,
    balance DECIMAL(12,2) NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updatedAt TIMESTAMPTZ NOT NULL,
    deletedAt TIMESTAMPTZ
);

-- +goose Down
DROP TABLE accounts;
