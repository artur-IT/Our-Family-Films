import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await getCollection();
    const movies = await collection.find({}).toArray();
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Błąd pobierania" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const movieData = await request.json();
    const collection = await getCollection();
    await collection.insertOne(movieData);

    return NextResponse.json({
      success: true,
      data: movieData,
    });
  } catch (error) {
    console.error("Błąd dodawania filmu:", error);
    return NextResponse.json({ error: "Błąd dodawania" }, { status: 500 });
  }
}
