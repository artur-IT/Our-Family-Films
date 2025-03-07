import { MovieData } from "@/types/types";
import { MongoClient } from "mongodb";

// Getting the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "myFirstBase";
const COLLECTION_MOVIES = "our_movies";
const COLLECTION_USERS = "our_movies_Users";

if (!MONGODB_URI) {
  throw new Error("Add MONGODB_URI to your .env file");
}

// Defining an interface for MongoDB connection management
interface MongoConnection {
  client: MongoClient | null; // MongoClient instance or null if not connected
  promise: Promise<MongoClient> | null; // Promise for the MongoClient connection or null
}

// Creating a connection object to manage the MongoDB client and its promise
const connection: MongoConnection = {
  client: null,
  promise: null,
};

export async function getMongoClient() {
  // If we already have a client, return it
  if (connection.client) {
    return connection.client;
  }
  // If we don't have a promise for the connection, create one
  if (!connection.promise) {
    connection.promise = MongoClient.connect(MONGODB_URI as string);
  }

  // Wait for the promise to resolve and set the client
  connection.client = await connection.promise;
  return connection.client; // Return the MongoDB client
}

// Function to get the database instance
export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(DATABASE_NAME); // Return the database instance
}

export async function getCollectionMovies(collectionName = COLLECTION_MOVIES) {
  const db = await getDatabase();
  return db.collection(collectionName); // Return the specified collection
}

export async function getCollectionUsers(collectionName = COLLECTION_USERS) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export async function getMovies() {
  const collection = await getCollectionMovies();
  return collection;
}

// Function to add a new movie to the movies collection
export async function addMovie(movieData: MovieData) {
  const collection = await getCollectionMovies(); // Get the movies collection
  return collection.insertOne(movieData); // Insert the new movie data into the collection
}
