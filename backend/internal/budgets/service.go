package budgets

import (
	"context"
	"errors"
	"fmt"
	"strings"
)

type budgetService struct {
	repository budgetRepository
}

func NewBudgetService(repository budgetRepository) *budgetService {
	return &budgetService{
		repository: repository,
	}
}

func (b *budgetService) CreateBudget(ctx context.Context, budget Budget) (Budget, error) {
	if budget.Amount < float64(0) {
		return Budget{}, errors.New("budget must not be lower than 0")
	}

	budget.Currency = strings.ToUpper(strings.TrimSpace(budget.Currency))

	if budget.Currency == "" {
		budget.Currency = "PHP"
	}

	if len(budget.Currency) != 3 {
		return Budget{}, errors.New("sige ipilit mo gusto mo lokoooo")
	}
	createdBudget, err := b.repository.CreateBudget(ctx, budget)
	if err != nil {
		return Budget{}, fmt.Errorf("error: %w", err)
	}

	return createdBudget, nil
}
