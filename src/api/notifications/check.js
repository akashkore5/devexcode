import { MongoClient } from "mongodb";

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
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const client = await clientPromise;
    const db = client.db("leetcodesolve");
    const collection = db.collection("notifications");

    const subscription = await collection.findOne({ userId });
    res.status(200).json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error("Check subscription error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}