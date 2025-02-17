package main

import (
	"fmt"
	"log"
	"net/http"

	"Backend/config"
	"Backend/controllers"
	"Backend/routes"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	config.ConnectDB()                  // ✅ Step 1: Connect to the database
	controllers.InitHolidayController() // ✅ Step 2: Initialize the controller after DB connection

	router := mux.NewRouter()
	routes.RegisterHolidayRoutes(router)

	// ✅ CORS Middleware (Allow Frontend to Communicate)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allow requests from React app
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// ✅ Wrap router with CORS handler
	handler := corsHandler.Handler(router)

	fmt.Println("Server started on port 8081")
	log.Fatal(http.ListenAndServe(":8081", handler))
}
