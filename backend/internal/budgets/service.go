package budgets

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

type budgetService struct {
	repository budgetRepository
}

func NewBudgetService(repository budgetRepository) budgetService {
	return budgetService{
		repository: repository,
	}
}

func (b *budgetService) GetBudget(ctx context.Context, budget *Budget) (Budget, error) {
	exists, err := b.repository.BudgetExist(ctx)
	if err != nil {
		return Budget{}, fmt.Errorf("%w", err)
	}
	if !exists {
		return Budget{}, errors.New("create a budget first")
	}

	budgets, err := b.repository.GetBuget(ctx)
	if err != nil {
		return Budget{}, errors.New("no budget yet")
	}
	return budgets, nil
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
		return Budget{}, errors.New("sige ipilit mo gusto mo loko 3 lang sa currency sample PHP")
	}

	exists, err := b.repository.BudgetExist(ctx)
	if err != nil {
		return Budget{}, fmt.Errorf("checking existing budget: %w", err)
	}
	if exists {
		return Budget{}, errors.New("you can not create more budget")
	}

	createdBudget, err := b.repository.CreateBudget(ctx, &budget)
	if err != nil {
		return Budget{}, err
	}

	return createdBudget, nil
}

func (b *budgetService) UpdateBudget(ctx context.Context, budget *Budget) (Budget, error) {
	exists, err := b.repository.BudgetExist(ctx)
	if err != nil {
		return Budget{}, fmt.Errorf("checking existing budget: %w", err)
	}

	if !exists {
		return Budget{}, errors.New("create budget first")
	}
	if budget.ID == uuid.Nil {
		return Budget{}, errors.New("id is required")
	}
	if budget.Amount < float64(0) {
		return Budget{}, errors.New("budget must not be lower than 0")
	}

	budget.Currency = strings.ToUpper(strings.TrimSpace(budget.Currency))

	if budget.Currency == "" {
		budget.Currency = "PHP"
	}

	if len(budget.Currency) != 3 {
		return Budget{}, errors.New("sige ipilit mo gusto mo loko 3 lang sa currency sample PHP")
	}

	updateBudget, err := b.repository.UpdateBudget(ctx, *budget)
	if err != nil {
		return Budget{}, err
	}

	return updateBudget, nil
}
