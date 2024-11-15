// Plik TYLKO do LOKALNEGO TESTOWANIA - pobierania i zapisywania danych !!!
//-------------------------------------------------------------------------
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

import express from "express";
import cors from "cors"; // Importuj cors
import { connectToDatabase } from "./dbConnection.js";

const app = express();
const port = 3000;
app.use(express.json({ limit: process.env.MAX_BODY_SIZE || "10mb" }));
app.use(express.urlencoded({ limit: process.env.MAX_BODY_SIZE || "10mb", extended: true }));

app.use(cors()); // Dodaj to, aby zezwolić na CORS

// get posts from MongoDB
app.get("/api/getArticles", async (req, res) => {
  try {
    const database = await connectToDatabase();
    const articles = database.collection("posts");
    const result = await articles.find().sort({ date: -1 }).toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    res.status(500).json({ error: "Nie udało się pobrać artykułów" });
  }
});

// save new post to MongoDB
app.post("/api/addArticle", async (req, res) => {
  try {
    const database = await connectToDatabase();
    const articles = database.collection("posts");
    const newArticle = req.body;
    const result = await articles.insertOne(newArticle);
    res.status(201).json({ message: "Artykuł dodany pomyślnie", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Nie udało się dodać artykułu", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
