import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "myFirstBase";
const COLLECTION_NAME = "our_movies";

export async function GET() {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI as string);

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const movies = await collection.find().toArray();

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Szczegóły błędu:", error);
    return NextResponse.json({ error: "Nie udało się pobrać filmów z bazy danych" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
