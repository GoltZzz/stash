package budgets

import (
	"database/sql"
	"encoding/json"
	"log"
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
	s := NewBudgetService(r)
	h := NewBudgetHandler(s)
	h.handleRoutes(mux)
}

func (h budgetHandler) handleRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/budgets", h.handleGetBudget)
	mux.HandleFunc("POST /api/v1/budgets", h.handleCreate)
	mux.HandleFunc("PATCH /api/v1/budgets", h.handleUpdate)
}

func (h *budgetHandler) handleGetBudget(w http.ResponseWriter, r *http.Request) {
	b := Budget{}

	budget, err := h.service.GetBudget(r.Context(), &b)
	if err != nil {
		w.WriteHeader(http.StatusNoContent)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": error.Error(err)}); err != nil {
			log.Printf("errror: %v", err)
			return
		}
		return
	}

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(budget); err != nil {
		log.Printf("error: %v", err)
		return
	}
}

func (h *budgetHandler) handleCreate(w http.ResponseWriter, r *http.Request) {
	req := &BudgetPayload{}

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&req); err != nil {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": error.Error(err)}); err != nil {
			log.Printf("error: %v", err)
			return
		}
		return
	}

	budget := &Budget{
		Amount:   float64(req.Amount),
		Currency: req.Currency,
	}

	b, err := h.service.CreateBudget(r.Context(), *budget)
	if err != nil {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusConflict)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": error.Error(err)}); err != nil {
			log.Printf("error: %v", err)
			return
		}
		return
	}

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(b); err != nil {
		log.Printf("error: %v", err)
		return
	}
}

func (h *budgetHandler) handleUpdate(w http.ResponseWriter, r *http.Request) {
	req := &Budget{}
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&req); err != nil {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": error.Error(err)}); err != nil {
			log.Printf("error: %v", err)
			return
		}
		return
	}
	budget := &Budget{
		ID:        req.ID,
		Amount:    req.Amount,
		Currency:  req.Currency,
		CreatedAt: req.CreatedAt,
		UpdatedAt: req.UpdatedAt,
	}

	b, err := h.service.UpdateBudget(r.Context(), budget)
	if err != nil {
		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		if err := json.NewEncoder(w).Encode(map[string]string{"error": error.Error(err)}); err != nil {
			log.Printf("error: %v", err)
			return
		}

		return
	}

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	if err := json.NewEncoder(w).Encode(b); err != nil {
		log.Printf("error: %v", err)
		return
	}
}
