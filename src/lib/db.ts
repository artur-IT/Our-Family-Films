import { MovieData } from "@/types/types";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "myFirstBase";
const COLLECTION_NAME = "our_movies";

if (!MONGODB_URI) {
  throw new Error("Dodaj MONGODB_URI do zmiennych środowiskowych (.env)");
}

interface MongoConnection {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

const connection: MongoConnection = {
  client: null,
  promise: null,
};

export async function getMongoClient() {
  if (connection.client) {
    return connection.client;
  }
  if (!connection.promise) {
    connection.promise = MongoClient.connect(MONGODB_URI as string);
  }

  connection.client = await connection.promise;
  return connection.client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(DATABASE_NAME);
}

export async function getCollection(collectionName = COLLECTION_NAME) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Przykład użycia w API:
export async function getMovies() {
  const collection = await getCollection();
  return collection;
}

export async function addMovie(movieData: MovieData) {
  const collection = await getCollection();
  return collection.insertOne(movieData);
}
