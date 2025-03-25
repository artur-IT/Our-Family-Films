import { getCollectionMovies } from "@/lib/db";
import { NextResponse } from "next/server";

// ENDPOINT DO AKTUALIZACJI KOLEJNOŚCI FILMÓW
export async function POST(request: Request) {
  try {
    const { movies } = await request.json();
    const collection = await getCollectionMovies();
    // Aktualizuj każdy film z nowym polem order
    const updateOperations = movies.map((movie: { id: string }, index: number) => ({
      updateOne: {
        filter: { id: movie.id },
        update: { $set: { order: index } },
      },
    }));

    await collection.bulkWrite(updateOperations);

    return NextResponse.json({
      success: true,
      message: "Movie order updated successfully",
    });
  } catch (error) {
    console.error("Error updating movie order:", error);
    return NextResponse.json({ error: "Error updating order" }, { status: 500 });
  }
}
