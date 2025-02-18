package routes

import (
    "Backend/controllers"
    "github.com/gorilla/mux"
    "net/http"
)

func RegisterHolidayRoutes(router *mux.Router) {
    api := router.PathPrefix("/api/holidays").Subrouter()

    api.HandleFunc("", controllers.GetHolidays).Methods("GET", "OPTIONS")
    api.HandleFunc("", controllers.AddHoliday).Methods("POST", "OPTIONS")
    api.HandleFunc("/{id}", controllers.DeleteHoliday).Methods("DELETE", "OPTIONS")

    api.Use(corsMiddleware)
}

// Inline CORS middleware for simplicity
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "https://holiday-assignment.pages.dev")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}
