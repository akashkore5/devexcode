// pages/api/interview/mock-request.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, interviewType, preferredDate, message } = req.body;

  // Server-side validation
  if (!name || !email || !interviewType || !preferredDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "no-reply@devexcode.com",
      to: "akashkore5@gmail.com",
      subject: "Mock Interview Request - DevExCode",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: #4f46e5; padding: 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .content p { line-height: 1.6; margin: 10px 0; font-size: 16px; }
            .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DevExCode</h1>
            </div>
            <div class="content">
              <p><strong>New Mock Interview Request</strong></p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Interview Type:</strong> ${interviewType}</p>
              <p><strong>Preferred Date:</strong> ${preferredDate}</p>
              <p><strong>Message:</strong> ${message || "No additional message"}</p>
              <p>Please follow up with the user to schedule the mock interview.</p>
            </div>
            <div class="footer">
              <p>© 2025 DevExCode. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out after 10 seconds")), 10000)
      ),
    ]);

    return res.status(200).json({ message: "Mock interview request sent successfully." });
  } catch (error) {
    console.error("Mock Interview Request: Error:", error.message, error.stack);
    return res.status(500).json({ message: "Failed to send request: " + error.message });
  }
}