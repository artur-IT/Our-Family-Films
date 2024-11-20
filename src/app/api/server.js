// Plik TYLKO do LOKALNEGO TESTOWANIA - pobierania i zapisywania danych !!!
//-------------------------------------------------------------------------
import { format } from "date-fns";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

import express from "express";
import cors from "cors";
import { connectToDatabase } from "./dbConnection.js";

const app = express();
const port = 3000;
app.use(express.json({ limit: process.env.MAX_BODY_SIZE || "5mb" }));
app.use(express.urlencoded({ limit: process.env.MAX_BODY_SIZE || "5mb", extended: true }));

app.use(cors()); // Zezwolenie na CORS

// get posts from MongoDB
app.get("/api/getMovies", async (req, res) => {
  try {
    const database = await connectToDatabase();
    const movies = database.collection("our_movies");
    const result = await movies.find().sort({ date: -1 }).toArray();

    // Formatowanie daty w spójny sposób
    const formattedResults = result.map((article) => ({
      ...article,
      id: article.id.toString(),
    }));

    res.json(formattedResults);
    // console.log(result);
  } catch (error) {
    res.status(500).json({ error: "Nie udało się pobrać artykułów" });
  }
});

// save new post to MongoDB
// app.post("/api/addMovie", async (req, res) => {
//   try {
//     const database = await connectToDatabase();
//     const articles = database.collection("our_movies");
//     const newArticle = req.body;
//     const result = await articles.insertOne(newArticle);
//     res.status(201).json({ message: "Artykuł dodany pomyślnie", id: result.insertedId });
//   } catch (error) {
//     res.status(500).json({ error: "Nie udało się dodać artykułu", details: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
