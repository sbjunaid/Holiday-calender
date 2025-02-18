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
	config.ConnectDB()                  // Connect to MongoDB
	controllers.InitHolidayController() // Initialize controller

	router := mux.NewRouter()
	routes.RegisterHolidayRoutes(router)

	// Global CORS Middleware (Allow Frontend to Communicate)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://holiday-viewer.pages.dev"}, 
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true, 
	})

	//Wrap router with CORS middleware
	handler := corsHandler.Handler(router)

	fmt.Println("Server started on port 8081")
	log.Fatal(http.ListenAndServe(":8081", handler))
}
