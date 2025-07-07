import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.error(`[report-bug] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, url, userId } = req.body;

  // Validate required fields
  if (!title || !description || !url) {
    console.error(`[report-bug] Missing required fields:`, { title, description, url });
    return res.status(400).json({ error: "Title, description, and URL are required" });
  }

  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_USER || "no-reply@devexcode.com",
    to: "akashkore5@gmail.com",
    subject: `Bug Report: ${title}`,
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
          .content strong { color: #4f46e5; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .footer a { color: #4f46e5; text-decoration: none; }
          @media (max-width: 600px) {
            .content { padding: 20px; }
            .header h1 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DevExCode Bug Report</h1>
          </div>
          <div class="content">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Page URL:</strong> <a href="${url}">${url}</a></p>
            <p><strong>User ID:</strong> ${userId || "Anonymous"}</p>
            <p>This bug report was submitted via the DevExCode website.</p>
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
    // Send email with 10-second timeout
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out after 10 seconds")), 10000)
      ),
    ]);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(`[report-bug] Email sending error:`, error.message);
    return res.status(500).json({ error: "Failed to send bug report email" });
  }
}