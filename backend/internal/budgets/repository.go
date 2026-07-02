package budgets

import (
	"context"
	"database/sql"
	"fmt"
	"log"
)

type budgetRepository struct {
	db *sql.DB
}

func NewBudgetrepository(db *sql.DB) budgetRepository {
	return budgetRepository{db: db}
}

func (b budgetRepository) GetBuget(ctx context.Context) (Budget, error) {
	q := `SELECT * FROM budgets`

	budget := Budget{}
	err := b.db.QueryRowContext(ctx, q).Scan(&budget.ID, &budget.Amount, &budget.Currency, &budget.CreatedAt, &budget.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return Budget{}, fmt.Errorf("%w", err)
		}
		return Budget{}, fmt.Errorf("%w", err)
	}
	log.Printf("get budget query failed: %v", err)
	return budget, nil
}

func (b *budgetRepository) CreateBudget(ctx context.Context, budget *Budget) (Budget, error) {
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
		return Budget{}, fmt.Errorf("%w", err)
	}
	log.Printf("create budget query failed: %v", err)
	return *budget, nil
}

func (b *budgetRepository) UpdateBudget(ctx context.Context, budget Budget) (Budget, error) {
	q := `UPDATE budgets
	SET amount = $1, currency = $2
	WHERE id = $3
	RETURNING id, amount, currency, created_at, updated_at
	`
	err := b.db.QueryRowContext(ctx, q, budget.Amount, budget.Currency, budget.ID).Scan(&budget.ID, &budget.Amount, &budget.Currency, &budget.CreatedAt, &budget.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return Budget{}, fmt.Errorf("%w", err)
		}
		return Budget{}, fmt.Errorf("%w", err)
	}

	log.Printf("update budget query failed: %v", err)
	return budget, nil
}

func (b *budgetRepository) BudgetExist(ctx context.Context) (bool, error) {
	var exist bool
	q := `SELECT EXISTS(SELECT 1 FROM BUDGETS)`
	err := b.db.QueryRowContext(ctx, q).Scan(&exist)
	if err != nil {
		return exist, err
	}
	log.Printf("budget exist query failed: %v", err)
	return exist, nil
}
