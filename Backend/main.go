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
    config.ConnectDB()
    controllers.InitHolidayController()
    router := mux.NewRouter()
    routes.RegisterHolidayRoutes(router)

    // Enhanced CORS configuration
    corsHandler := cors.New(cors.Options{
        AllowedOrigins: []string{
            "https://a16fc0ec.holiday-app.pages.dev",
        },
        AllowedMethods: []string{
            "GET", 
            "POST", 
            "PUT", 
            "DELETE", 
            "OPTIONS",
        },
        AllowedHeaders: []string{
            "Content-Type",
            "Authorization",
            "Origin",
            "Accept",
            "X-Requested-With",
        },
        ExposedHeaders:   []string{"Content-Length"},
        AllowCredentials: true,
        Debug:           true,  
        MaxAge:          300,   
    })

    handler := corsHandler.Handler(router)
    
    fmt.Println("Server started on port 8081")
    log.Fatal(http.ListenAndServe(":8081", handler))
}
