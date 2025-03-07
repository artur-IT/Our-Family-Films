import { getCollectionMovies } from "@/lib/db";
import { NextResponse } from "next/server";

// ENDPOINT TO GET ALL MOVIES FROM MONGODB
export async function GET() {
  try {
    const collection = await getCollectionMovies();
    const movies = await collection.find({}).toArray();
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// ENDPOINT TO UPDATE MOVIE DATA IN MONGODB
export async function PATCH(request: Request) {
  try {
    // Parse the incoming request JSON to get movie data
    const movieData = await request.json();
    // Destructure the id and the rest of the data to update
    const { id, ...updateData } = movieData;
    const collection = await getCollectionMovies();

    const result = await collection.updateOne({ id: id }, { $set: updateData });

    // Check if any movie was matched for the update
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    // Return a success response with the updated movie data
    return NextResponse.json({
      success: true,
      message: "Movie has been updated",
      data: movieData,
    });
  } catch (error) {
    console.error("Movie update error:", error);
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}

// ENDPOINT TO ADD NEW MOVIE TO MONGODB
export async function POST(request: Request) {
  try {
    const movieData = await request.json();
    const collection = await getCollectionMovies();
    await collection.insertOne(movieData);

    return NextResponse.json({
      success: true,
      data: movieData,
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    return NextResponse.json({ error: "Error adding" }, { status: 500 });
  }
}

// ENDPOINT TO DELETE MOVIE FROM MONGODB
export async function DELETE(request: Request) {
  try {
    // Parse the incoming request JSON to get the movie id
    const { id } = await request.json();
    const collection = await getCollectionMovies();
    const result = await collection.deleteOne({ id: id });

    // Check if a movie was successfully deleted
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Movie has been deleted" });
    } else {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
