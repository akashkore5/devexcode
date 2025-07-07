import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth/next";
import { getDb } from "../../lib/mongodb"; // Adjust path to match your project structure
import { getAuthOptions } from "../../lib/auth"; // Adjust path to match your project structure
import { ObjectId } from "mongodb";// Import NextAuth CSRF utility

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

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendContributionEmail(contributionData) {
  const { articleId, url, title, content, userEmail } = contributionData;

  const mailOptions = {
    from: process.env.EMAIL_USER || "no-reply@devexcode.com",
    to: "akashkore5@gmail.com",
    subject: `New Contribution for Article: ${title}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: #4f46e5; padding: 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .content p { line-height: 1.6; margin: 10px 0; font-size: 16px; }
          .content pre { background: #f8f8f8; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 14px; }
          .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff !important; text-decoration: none !important; border-radius: 6px; font-weight: 600; margin: 15px 0; }
          .button:hover { background: #4338ca; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .footer a { color: #4f46e5; text-decoration: none; }
          @media (max-width: 600px) {
            .content { padding: 20px; }
            .header h1 { font-size: 20px; }
            .button { padding: 10px 20px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DevExCode Contribution</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>A new contribution has been submitted for the article "<strong>${title}</strong>" (ID: ${articleId}).</p>
            <p><strong>Contributor Email:</strong> ${userEmail}</p>
            <p><strong>Article URL:</strong> <a href="${url}">${url}</a></p>
            <p><strong>Proposed Changes:</strong></p>
            <pre>${content}</pre>
            <a href="${url}" class="button" role="button">View Article</a>
            <p>Please review the proposed changes and update the article as needed.</p>
          </div>
          <div class="footer">
            <p>© 2025 DevExCode. All rights reserved.</p>
            <p><a href="https://devexcode.com">Visit our website</a> | <a href="https://devexcode.com/contact">Contact Us</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out after 10 seconds")), 10000)
      ),
    ]);
    
    return { emailStatus: "success" };
  } catch (error) {
    console.error(
      `[contributions] Email error for articleId: ${articleId}, contributor: ${userEmail}`,
      error.message
    );
    return { emailStatus: "failed", error: error.message };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.error(`[contributions] Method not allowed: ${req.method}`);
    return res.status(405).json({ message: "Method not allowed" });
  }

  let db;
  try {
    db = await getDb();
    
  } catch (error) {
    console.error("[contributions] Failed to connect to database:", error.message, error.stack);
    return res.status(500).json({ message: "Database connection failed" });
  }

  let authOptions;
  try {
    authOptions = await getAuthOptions({ db, mongoClient: await db.client });
    
  } catch (error) {
    console.error("[contributions] Failed to initialize auth options:", error.message, error.stack);
    return res.status(500).json({ message: "Authentication configuration error" });
  }

  const session = await getServerSession(req, res, authOptions);
  console.log("[contributions] Session result:", {
    userId: session?.user?.id,
    email: session?.user?.email,
  });

  if (!session) {
    
    return res.status(401).json({ message: "Please sign in to submit a contribution" });
  }

  // Verify user exists
  let user;
  try {
    const userId = session.user.id;
    
    if (!ObjectId.isValid(userId)) {
      console.error("[contributions] Invalid user ID format:", userId);
      return res.status(401).json({ message: "Invalid user ID format" });
    }
    user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      
      user = await db.collection("users").findOne({ email: session.user.email });
      if (!user) {
        console.error("[contributions] User not found for ID or email:", {
          id: userId,
          email: session.user.email,
        });
        return res.status(401).json({ message: "User not found in database" });
      }
      
    }
    console.log("[contributions] User verified:", {
      id: user._id.toString(),
      email: user.email,
    });
  } catch (error) {
    console.error("[contributions] Error verifying user:", error.message, error.stack);
    return res.status(500).json({ message: "Failed to verify user" });
  }

  try {
    
    const { articleId, url, title, content, csrfToken } = req.body;

    if (!articleId || !url || !title || !content || !csrfToken) {
      console.error("[contributions] Missing required fields:", {
        articleId: !!articleId,
        url: !!url,
        title: !!title,
        content: !!content,
        csrfToken: !!csrfToken,
      });
      return res.status(400).json({ message: "Missing required fields or CSRF token" });
    }

    // Verify CSRF token using NextAuth's CSRF token utility
    const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`;
    
    let serverCsrfToken;
    try {
      // Fetch CSRF token with session cookies to ensure same session context
      const resCsrf = await fetch(`${baseUrl}/api/auth/csrf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "", // Pass client cookies
        },
      });
      if (!resCsrf.ok) {
        console.error("[contributions] Failed to fetch CSRF token:", resCsrf.status);
        return res.status(500).json({ message: "Failed to verify CSRF token" });
      }
      const csrfData = await resCsrf.json();
      serverCsrfToken = csrfData.csrfToken;
      if (!serverCsrfToken) {
        console.error("[contributions] No CSRF token in response:", csrfData);
        return res.status(500).json({ message: "CSRF token not found in response" });
      }
    } catch (error) {
      console.error("[contributions] Error fetching CSRF token:", error.message, error.stack);
      return res.status(500).json({ message: "Failed to fetch CSRF token" });
    }

    if (csrfToken !== serverCsrfToken) {
      console.error("[contributions] Invalid CSRF token:", {
        received: csrfToken,
        expected: serverCsrfToken,
      });
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
    

    // Validate content length
    if (content.trim().length === 0) {
      console.error("[contributions] Empty content");
      return res.status(400).json({ message: "Contribution content cannot be empty" });
    }
    if (content.length > 10000) {
      console.error("[contributions] Content too long:", content.length);
      return res.status(400).json({ message: "Contribution content cannot exceed 10000 characters" });
    }

    // Store contribution in MongoDB
    const contribution = {
      articleId,
      url,
      title,
      content,
      userEmail: user.email,
      userId: user._id.toString(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    await db.collection("contributions").insertOne(contribution);
    

    // Send email notification
    const emailResult = await sendContributionEmail(contribution);
    if (emailResult.emailStatus === "failed") {
      console.error(`[contributions] Failed to send email for articleId: ${articleId}`);
      return res.status(500).json({ message: "Failed to send contribution email" });
    }

    res.status(200).json({ message: "Contribution submitted successfully" });
  } catch (error) {
    console.error("[contributions] Error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
}