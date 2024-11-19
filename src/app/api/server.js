// Plik TYLKO do LOKALNEGO TESTOWANIA - pobierania i zapisywania danych !!!
//-------------------------------------------------------------------------
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
app.get("/api/getArticles", async (req, res) => {
  try {
    const database = await connectToDatabase();
    const articles = database.collection("our_movies");
    const result = await articles.find().sort({ date: -1 }).toArray();
    res.json(result);
    // console.log(result);
  } catch (error) {
    res.status(500).json({ error: "Nie udało się pobrać artykułów" });
  }
});

// save new post to MongoDB
// app.post("/api/addArticle", async (req, res) => {
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
