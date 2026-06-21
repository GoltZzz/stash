package budgets

import (
	"time"

	"github.com/google/uuid"
)


type Budget struct{
	ID uuid.UUID `json:"id"`
	Amount float64 `json:"amount"`
	Currency string `json:"currency"`
	CreatedAt *time.Time `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}

type BudgetPayload struct{
	Amount float64 `json:"amount"`
	Currency string `json:"currency"`
}
