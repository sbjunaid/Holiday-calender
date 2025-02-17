package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"Backend/config"
	"Backend/models"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var holidayCollection *mongo.Collection

// Initialize the collection AFTER the database connection is established
func InitHolidayController() {
	if config.DB == nil {
		log.Fatal(" Database connection is nil. Ensure ConnectDB() is called before initializing controllers.")
	}
	holidayCollection = config.DB.Collection("holidays")
	fmt.Println(" Holiday collection initialized")
}

// Fetch holidays (GET /api/holidays)
func GetHolidays(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" Received GET request for holidays")

	// Query all holidays
	cursor, err := holidayCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Println(" Error fetching holidays:", err)
		http.Error(w, "Error fetching holidays", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var holidays []models.Holiday
	for cursor.Next(context.TODO()) {
		var holiday models.Holiday
		if err := cursor.Decode(&holiday); err != nil {
			log.Println(" Error decoding holiday:", err)
			continue
		}
		holidays = append(holidays, holiday)
	}

	// Log what we fetched
	fmt.Println(" Holidays fetched:", holidays)

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(holidays)
}

// Add holiday (POST /api/holidays)
func AddHoliday(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" Received POST request to add holiday")

	var holiday models.Holiday
	if err := json.NewDecoder(r.Body).Decode(&holiday); err != nil {
		log.Println(" Error decoding request body:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Assign a new ObjectID
	holiday.ID = primitive.NewObjectID()
	result, err := holidayCollection.InsertOne(context.TODO(), holiday)
	if err != nil {
		log.Println(" Could not insert holiday:", err)
		http.Error(w, "Could not add holiday", http.StatusInternalServerError)
		return
	}

	// Send JSON response with inserted ID
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Holiday added successfully",
		"id":      result.InsertedID,
	})

	fmt.Println(" Holiday added:", holiday)
}

// Delete holiday (DELETE /api/holidays/{id})
func DeleteHoliday(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" Received DELETE request for a holiday")

	params := mux.Vars(r)
	holidayID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		log.Println(" Invalid holiday ID:", err)
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	// Delete the holiday
	result, err := holidayCollection.DeleteOne(context.TODO(), bson.M{"_id": holidayID})
	if err != nil {
		log.Println(" Could not delete holiday:", err)
		http.Error(w, "Could not delete holiday", http.StatusInternalServerError)
		return
	}

	// Check if the holiday was found
	if result.DeletedCount == 0 {
		http.Error(w, "Holiday not found", http.StatusNotFound)
		return
	}

	// Send success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Holiday deleted successfully"})

	fmt.Println(" Holiday deleted:", holidayID)
}
