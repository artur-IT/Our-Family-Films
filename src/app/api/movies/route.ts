import { clientPromise } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myFirstBase");
    const movies = await db.collection("our_movies").find().sort({ date: -1 }).toArray();

    return NextResponse.json(movies);
  } catch (error: any | unknown) {
    return NextResponse.json({ error: `Nie udało się pobrać filmów: ${error.message}` }, { status: 500 });
  }
}
