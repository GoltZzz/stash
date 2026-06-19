package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func ConnectDB() (*sql.DB, error) {
	DBHost := os.Getenv("DBHOST")
	DBUser := os.Getenv("DBUSER")
	DBPass := os.Getenv("DBPASS")
	DBName := os.Getenv("DBNAME")
	DBPort := os.Getenv("DBPORT")

	defaultDsn := fmt.Sprintf("postgres://%s:%s@%s:%v/postgres?sslmode=disable", DBUser, DBPass, DBHost, DBPort)

	db, err := sql.Open("postgres", defaultDsn)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	q := `CREATE DATABASE stash`

	var exists bool
	err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'stash')`).Scan(&exists)
	if err != nil {
		return nil, err
	}
	if !exists {
		_, err = db.Exec(q)
		if err != nil {
			return nil, fmt.Errorf("creating database: %w", err)
		}
	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%v/%s?sslmode=disable", DBUser, DBPass, DBHost, DBPort, DBName)
	stashDb, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	if err = stashDb.Ping(); err != nil {
		log.Fatal(err)
		return nil, err
	}

	return stashDb, nil
}
