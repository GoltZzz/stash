package main

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/GoltZzz/stash-backend/internal/db"
	"github.com/joho/godotenv"
)

func main(){
	godotenv.Load("../.env")
	db, err := db.ConnectDB()
	if err != nil{
		log.Fatal(err)
		return
	}
	defer db.Close()

	fmt.Println("Connected to Database")

	mux := http.NewServeMux()

	svr := http.Server{
		Addr: ":42069",
		Handler: mux,
	}
	log.Println("App is listening to",svr.Addr)
	if err := svr.ListenAndServe(); err != nil && err != http.ErrServerClosed{
		slog.Error("server error", err)
		os.Exit(1)
	}
}
