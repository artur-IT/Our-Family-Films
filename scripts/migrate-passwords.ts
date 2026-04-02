/**
 * Migration script to hash existing plain text passwords in the database
 * 
 * This script should be run once to convert all plain text passwords to hashed passwords.
 * After running this script, all passwords will be securely hashed using bcrypt.
 * 
 * Usage:
 * 1. Make sure you have MONGODB_URI in your .env file
 * 2. Run: npx ts-node scripts/migrate-passwords.ts
 * 
 * WARNING: Make sure to backup your database before running this script!
 */

import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

// Get MongoDB connection details
// You should set MONGODB_URI in your .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vercel-admin-user-6703a71951df322efc1f187a:FNGsib8AhXU4LJp8@cluster0.r4uz6i5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DATABASE_NAME = "myFirstBase";
const COLLECTION_USERS = "our_movies_Users";

const SALT_ROUNDS = 10;

async function migratePasswords() {
  let client: MongoClient | null = null;

  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_USERS);

    const users = await collection.find({}).toArray();

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const password = user.password;

      if (!password || typeof password !== "string") {
        skippedCount++;
        continue;
      }

      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (password.startsWith("$2a$") || password.startsWith("$2b$")) {
        skippedCount++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Update the user in the database
      await collection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      migratedCount++;
    }

  } catch (error) {
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run the migration
migratePasswords()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });

