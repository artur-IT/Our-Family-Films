import { getCollectionUsers } from "@/lib/db";
import { NextResponse } from "next/server";
import { comparePassword, hashPassword } from "@/lib/auth";

// ENDPOINT TO GET ALL USERS FROM MONGODB
// Note: This endpoint should not return passwords for security reasons
export async function GET() {
  try {
    const collection = await getCollectionUsers();
    const users = await collection.find({}).toArray();
    // Remove password field from response for security
    const usersWithoutPasswords = users.map(({  ...user }) => user);
    // Return the users as a JSON response (without passwords)
    return NextResponse.json(usersWithoutPasswords);
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

    // If password is being updated, hash it before storing
    if (updateData.password) {
      // Validate that password is a string before processing
      if (typeof updateData.password !== "string") {
        return NextResponse.json({ error: "Password must be a string" }, { status: 400 });
      }

      // Check if password is already hashed (starts with $2a$ or $2b$)
      const isAlreadyHashed = updateData.password.startsWith("$2a$") || updateData.password.startsWith("$2b$");
      
      if (!isAlreadyHashed) {
        updateData.password = await hashPassword(updateData.password);
      }
    }

    // Update the user data in the collection based on the provided id
    const result = await collection.updateOne({ id: id }, { $set: updateData });

    // Check if any user was matched for the update
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove password from response for security
    const {  ...responseData } = movieData;

    // Return a success response with the updated user data (without password)
    return NextResponse.json({
      success: true,
      message: "User has been updated",
      data: responseData,
    });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Update error" }, { status: 500 });
  }
}

// ENDPOINT TO AUTHENTICATE USER (LOGIN)
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate that both username and password are provided
    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 });
    }

    const collection = await getCollectionUsers();
    // Find user by username only (we don't compare password here)
    const user = await collection.findOne({ username });

    // If user doesn't exist, return authentication failure
    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    // This works for both hashed passwords (new) and plain text passwords (old - for migration)
    // Check if stored password is a string and if it's already hashed
    const isPasswordValid = 
      typeof user.password === "string" && (user.password.startsWith("$2b$") || user.password.startsWith("$2a$"))
        ? await comparePassword(password, user.password)
        : user.password === password; // Fallback for old plain text passwords during migration

    if (!isPasswordValid) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Return success with user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name || user.username,
      },
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
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
