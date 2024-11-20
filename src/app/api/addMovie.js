import { connectToDatabase } from "./dbConnection.js";

export default async function addMovie(req, res) {
  if (req.method === "POST") {
    const { id, title, content, author, date, picture } = req.body;
    try {
      const database = await connectToDatabase();
      const movies = database.collection("our_films");
      const result = await movies.insertOne({
        id,
        title,
        content,
        author,
        date,
        picture,
      });

      res.status(200).json({ message: "Artykuł dodany pomyślnie", id: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: `Nie udało się dodać artykułu: ${error.message} ` });
    }
  } else {
    res.status(405).json({ error: "Metoda nie jest dozwolona" });
  }
}
