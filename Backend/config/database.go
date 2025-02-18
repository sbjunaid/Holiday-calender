package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
	// Get MongoDB URI from environment variable
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal(" MONGO_URI environment variable is not set")
	}

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(" Error connecting to MongoDB:", err)
	}

	// Ping the database to ensure connection is successful
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(" MongoDB ping failed:", err)
	}

	fmt.Println(" Connected to MongoDB!")

	// Assign database (make sure this name matches your MongoDB database name)
	DB = client.Database("holidayDB")

	if DB == nil {
		log.Fatal(" Database connection is nil!")
	}
}
