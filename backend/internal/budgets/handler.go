package budgets

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type budgetHandler struct {
	service budgetService
}

func NewBudgetHandler(service budgetService) *budgetHandler {
	return &budgetHandler{
		service: service,
	}
}

func RegisterBudgetRoutes(mux *http.ServeMux, db *sql.DB) {
	r := NewBudgetrepository(db)
	s := NewBudgetService(*r)
	h := NewBudgetHandler(*s)
	h.handleRoutes(mux)
}

func (h budgetHandler) handleRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/v1/budgets", h.handleCreate)
}

func (h *budgetHandler) handleCreate(w http.ResponseWriter, r *http.Request) {
	req := &BudgetPayload{}

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&req); err != nil {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Mali mali request mo huuuyyyy"})
		return
	}

	budget := &Budget{
		Amount:   float64(req.Amount),
		Currency: req.Currency,
	}

	b, err := h.service.CreateBudget(r.Context(), *budget)
	if err != nil {
		http.Error(w, "invalid request BOI", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(b)
}
