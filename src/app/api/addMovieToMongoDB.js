import clientPromise from "../../lib/db";

export default async function addMovieToMongoDB(req, res) {
  if (req.method === "POST") {
    const { id, title, type, genre, rating, comments, image } = req.body;
    try {
      const database = await clientPromise;
      const movies = database.collection("our_films");
      const result = await movies.insertOne({
        id,
        title,
        type,
        genre,
        rating,
        comments,
        image,
      });

      res.status(200).json({ message: "Artykuł dodany pomyślnie", id: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: `Nie udało się dodać artykułu: ${error.message} ` });
    }
  } else {
    res.status(405).json({ error: "Metoda nie jest dozwolona" });
  }
}
