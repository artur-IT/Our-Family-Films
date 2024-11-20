import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Brak MONGODB_URI w zmiennych środowiskowych");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // W trybie development używamy globalnej zmiennej
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(
      "mongodb+srv://vercel-admin-user-6703a71951df322efc1f187a:FNGsib8AhXU4LJp8@cluster0.r4uz6i5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      options
    );
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // W produkcji tworzymy nowe połączenie
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { clientPromise };
