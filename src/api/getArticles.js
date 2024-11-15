import { connectToDatabase } from "./dbConnection.js";

// Get all posts from MongoDB
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const database = await connectToDatabase();
      const articles = database.collection("posts");
      const result = await articles.find().sort({ date: -1 }).toArray();
      res.status(200).json(result);
    } catch (error) {
      console.error("Błąd podczas pobierania artykułów:", error);
      res.status(500).json({ error: "Nie udało się pobrać artykułów", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
