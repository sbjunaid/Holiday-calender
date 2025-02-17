package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
	uri := "mongodb+srv://brook1hire:W8BK7mpH00VSTOZi@cluster0.5vhy6.mongodb.net/"

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	// Ping the database to ensure connection is successful
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB ping failed:", err)
	}

	fmt.Println("Connected to MongoDB!")

	// Assign database (make sure this name matches your MongoDB database name)
	DB = client.Database("holidayDB")

	if DB == nil {
		log.Fatal("Database connection is nil!")
	}
}
