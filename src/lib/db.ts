import { MovieData } from "@/types/types";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "myFirstBase";
const COLLECTION_MOVIES = "our_movies";
const COLLECTION_USERS = "our_movies_Users";

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

export async function getCollectionMovies(collectionName = COLLECTION_MOVIES) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export async function getCollectionUsers(collectionName = COLLECTION_USERS) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Przykład użycia w API:
export async function getMovies() {
  const collection = await getCollectionMovies();
  return collection;
}
export async function addMovie(movieData: MovieData) {
  const collection = await getCollectionMovies();
  return collection.insertOne(movieData);
}
