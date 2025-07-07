// pages/api/forgot-password.js
import { withDb } from '../../../middleware/db';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  // Server-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  
  try {
    const db = req.db;
    

    const user = await db.collection('users').findOne(
      { email: email.trim().toLowerCase() },
      { projection: { _id: 1, email: 1 } } // Limit fields
    );
    if (!user) {
      // Avoid revealing email existence to prevent enumeration attacks
      return res.status(200).json({ message: 'If an account exists, a reset email has been sent.' });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Update user with reset token (use $setOnInsert to avoid overwriting if token exists)
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      },
      { upsert: false }
    );

    // Configure transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;
    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@devexcode.com',
      to: email,
      subject: 'Password Reset Request - DevExCode',
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
              <h1>DevExCode</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested a password reset for your DevExCode account. Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button" role="button">Reset Password</a>
              <p>This link will expire in 1 hour for your security.</p>
              <p>If you did not request a password reset, please ignore this email or contact us at <a href="mailto:support@devexcode.com">support@devexcode.com</a>.</p>
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

    // Send email with timeout to prevent hanging
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email sending timed out after 10 seconds')), 10000)
      ),
    ]);
    

    return res.status(200).json({ message: 'If an account exists, a reset email has been sent.' });
  } catch (error) {
    console.error('Forgot Password: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Email sending timed out')) {
      return res.status(500).json({ message: 'Failed to send reset email due to timeout. Please try again later.' });
    }
    return res.status(500).json({ message: `Failed to process request: ${error.message}` });
  }
});