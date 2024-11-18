import { connectToDatabase } from "./dbConnection.js";

// Get all posts from MongoDB
export const handler = async (req, res) => {
  // console.log("plik: getArticles.js");
  if (req.method === "GET") {
    try {
      const database = await connectToDatabase();
      const articles = database.collection("our_movies");
      const result = await articles.find().sort({ date: -1 }).toArray();
      res.status(200).json(result);
      // console.log(result);
    } catch (error) {
      console.error("Błąd podczas pobierania artykułów:", error);
      res.status(500).json({ error: "Nie udało się pobrać artykułów", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
