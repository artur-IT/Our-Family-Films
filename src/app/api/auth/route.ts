import { getCollectionUsers } from "@/lib/db";
import { NextResponse } from "next/server";

// ENDPOINT TO GET ALL USERS FROM MONGODB
export async function GET() {
  try {
    const collection = await getCollectionUsers();
    const users = await collection.find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// ENDPOINT TO UPDATE USER DATA IN MONGODB
export async function PATCH(request: Request) {
  try {
    const movieData = await request.json();
    const { id, ...updateData } = movieData;
    const collection = await getCollectionUsers();

    const result = await collection.updateOne({ id: id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Nie znaleziono Użytkownika" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Użytkownik został zaktualizowany",
      data: movieData,
    });
  } catch (error) {
    console.error("Błąd aktualizacji użytkownika:", error);
    return NextResponse.json({ error: "Błąd aktualizacji" }, { status: 500 });
  }
}

// ENDPOINT TO ADD NEW USER TO MONGODB
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const collection = await getCollectionUsers();
    const user = await collection.findOne({ username, password });

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          // role: user.role,
        },
      });
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error("Błąd dodawania użytkownika:", error);
    return NextResponse.json({ error: "Błąd autoryzacji" }, { status: 500 });
  }
}

// ENDPOINT TO DELETE USER FROM MONGODB
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const collection = await getCollectionUsers();
    const result = await collection.deleteOne({ id: id });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Użytkownik został usunięty" });
    } else {
      return NextResponse.json({ message: "Nie znaleziono użytkownika" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
