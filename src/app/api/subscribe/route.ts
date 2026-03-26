import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const blobKey = "subscribers.json";

    // Fetch existing subscribers
    let subscribers = [];
    try {
      const { blobs } = await list({ prefix: blobKey });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        subscribers = await response.json();
      }
    } catch (error) {
      console.error("Error reading blob:", error);
    }

    // Check for duplicate email
    if (subscribers.some((sub: any) => sub.email === email)) {
      return NextResponse.json({ message: "Email already subscribed" }, { status: 400 });
    }

    // Add new subscriber
    const newSubscriber = {
      email,
      date: new Date().toISOString(),
    };
    subscribers.push(newSubscriber);

    // Update blob
    await put(blobKey, JSON.stringify(subscribers, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false, // Ensure we keep the same name for overwriting
    });

    return NextResponse.json({ message: "Thanks for subscribing!" });
  } catch (error) {
    console.error("Error handling subscription:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
