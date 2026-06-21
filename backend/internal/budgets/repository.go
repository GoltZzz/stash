package budgets

import (
	"context"
	"database/sql"
	"fmt"
)

type budgetRepository struct {
	db *sql.DB
}

func NewBudgetrepository(db *sql.DB) *budgetRepository {
	return &budgetRepository{db: db}
}

func (b *budgetRepository) CreateBudget(ctx context.Context, budget Budget) (Budget, error) {
	q := `INSERT INTO budgets (id,amount, currency)
	VALUES (
		gen_random_uuid(),
		$1,
		$2
	)
	RETURNING id, amount, currency, created_at, updated_at
	`
	err := b.db.QueryRowContext(ctx, q, budget.Amount, budget.Currency).Scan(&budget.ID, &budget.Amount, &budget.Currency, &budget.CreatedAt, &budget.UpdatedAt)
	if err != nil {
		return Budget{}, fmt.Errorf("error: %w", err)
	}
	return budget, nil
}
