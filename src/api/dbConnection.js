import { MongoClient } from "mongodb";

// OPEN CONNECTION TO MONGODB
const uri =
  "mongodb+srv://vercel-admin-user-6703a71951df322efc1f187a:FNGsib8AhXU4LJp8@cluster0.r4uz6i5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Połączono z bazą danych MongoDB");
    return client.db("myFirstBase");
  } catch (error) {
    console.error("Błąd połączenia z bazą danych:", error);
    process.exit(1);
  }
}
