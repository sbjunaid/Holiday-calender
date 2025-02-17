package routes

import (
	"Backend/controllers"

	"github.com/gorilla/mux"
)

func RegisterHolidayRoutes(router *mux.Router) {
	router.HandleFunc("/api/holidays", controllers.GetHolidays).Methods("GET")
	router.HandleFunc("/api/holidays", controllers.AddHoliday).Methods("POST")
	router.HandleFunc("/api/holidays/{id}", controllers.DeleteHoliday).Methods("DELETE")
}
