import { getCollectionUsers } from "@/lib/db";
import { NextResponse } from "next/server";

// ENDPOINT TO GET ALL USERS FROM MONGODB
export async function GET() {
  try {
    const collection = await getCollectionUsers();
    const users = await collection.find({}).toArray();
    // Return the users as a JSON response
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// ENDPOINT TO UPDATE USER DATA IN MONGODB
export async function PATCH(request: Request) {
  try {
    // Parse the incoming request JSON to get user data
    const movieData = await request.json();
    // Destructure the id and the rest of the data to update
    const { id, ...updateData } = movieData;
    const collection = await getCollectionUsers();

    // Update the user data in the collection based on the provided id
    const result = await collection.updateOne({ id: id }, { $set: updateData });

    // Check if any user was matched for the update
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return a success response with the updated user data
    return NextResponse.json({
      success: true,
      message: "User has been updated",
      data: movieData,
    });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}

// ENDPOINT TO ADD NEW USER TO MONGODB
export async function POST(request: Request) {
  try {
    // Parse the incoming request JSON to get username and password
    const { username, password } = await request.json();
    const collection = await getCollectionUsers();
    // Check if a user with the same username and password already exists
    const user = await collection.findOne({ username, password });

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
        },
      });
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Authorization error" }, { status: 500 });
  }
}

// ENDPOINT TO DELETE USER FROM MONGODB
export async function DELETE(request: Request) {
  try {
    // Parse the incoming request JSON to get the user id
    const { id } = await request.json();
    const collection = await getCollectionUsers();
    const result = await collection.deleteOne({ id: id });

    // Check if a user was successfully deleted
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "User has been deleted" });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
