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

// Number of salt rounds for password hashing
const SALT_ROUNDS = 10;

async function migratePasswords() {
  let client: MongoClient | null = null;

  try {
    console.log("🔗 Connecting to MongoDB...");
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_USERS);

    console.log("📋 Fetching all users...");
    const users = await collection.find({}).toArray();
    console.log(`Found ${users.length} users to process.`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const password = user.password;

      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (password && (password.startsWith("$2a$") || password.startsWith("$2b$"))) {
        console.log(`⏭️  Skipping user "${user.username}" - password already hashed`);
        skippedCount++;
        continue;
      }

      // Skip if password is empty or undefined
      if (!password) {
        console.log(`⚠️  Skipping user "${user.username}" - no password found`);
        skippedCount++;
        continue;
      }

      // Hash the plain text password
      console.log(`🔐 Hashing password for user "${user.username}"...`);
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Update the user in the database
      await collection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      console.log(`✅ Successfully migrated password for user "${user.username}"`);
      migratedCount++;
    }

    console.log("\n📊 Migration Summary:");
    console.log(`   ✅ Migrated: ${migratedCount} users`);
    console.log(`   ⏭️  Skipped: ${skippedCount} users`);
    console.log(`   📝 Total: ${users.length} users`);
    console.log("\n✨ Migration completed successfully!");

  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("🔌 Database connection closed.");
    }
  }
}

// Run the migration
migratePasswords()
  .then(() => {
    console.log("🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });

