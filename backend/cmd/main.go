package main

import (
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/GoltZzz/stash-backend/internal/budgets"
	"github.com/GoltZzz/stash-backend/internal/db"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load(".env", "../.env")
	db, err := db.ConnectDB()
	if err != nil {
		log.Fatal(err)
		return
	}
	defer db.Close()

	fmt.Println("Connected to Database")

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handleHealth)
	budgets.RegisterBudgetRoutes(mux, db)

	svr := http.Server{
		Addr:    ":42069",
		Handler: mux,
	}

	log.Println("App is listening to", svr.Addr)
	if err := svr.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		slog.Error("server error", err)
		os.Exit(1)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "API is Healthy"})
}
