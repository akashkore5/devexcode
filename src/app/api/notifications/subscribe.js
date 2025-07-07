import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { subscription, userId, email } = req.body;
    if (!subscription) {
      return res.status(400).json({ message: "Missing subscription" });
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const client = await clientPromise;
    const db = client.db("leetcodesolve");
    const collection = db.collection("notifications");

    // Generate userId if not provided (for anonymous users)
    const finalUserId = userId || uuidv4();

    // Check if subscription already exists
    const existing = await collection.findOne({ userId: finalUserId });
    if (existing) {
      await collection.updateOne(
        { userId: finalUserId },
        {
          $set: {
            subscription,
            email: email ? email.trim().toLowerCase() : existing.email, // Preserve existing email if not provided
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await collection.insertOne({
        userId: finalUserId,
        subscription,
        email: email ? email.trim().toLowerCase() : null, // Store email if provided, else null
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.status(200).json({ message: "Subscription saved", userId: finalUserId });
  } catch (error) {
    console.error("Notification subscription error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}