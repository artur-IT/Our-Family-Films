import { getCollection } from "@/lib/db";
import { NextResponse } from "next/server";

// ENDPOINT TO GET ALL MOVIES FROM MONGODB
export async function GET() {
  try {
    const collection = await getCollection();
    const movies = await collection.find({}).toArray();
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Błąd pobierania" }, { status: 500 });
  }
}

// ENDPOINT TO ADD NEW MOVIE TO MONGODB
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

// ENDPOINT TO DELETE MOVIE FROM MONGODB
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const collection = await getCollection();
    const result = await collection.deleteOne({ id: id });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Film został usunięty" });
    } else {
      return NextResponse.json({ message: "Nie znaleziono filmu" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Błąd podczas usuwania filmu" }, { status: 500 });
  }
}
