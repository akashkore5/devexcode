import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(email, name) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const mailOptions = {
    from: process.env.EMAIL_USER || 'no-reply@devexcode.com',
    to: email,
    subject: 'Welcome to DevExCode - Start Your Coding Journey!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DevExCode</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; }
          table { border-collapse: collapse; width: 100%; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e0e0e0; }
          .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; }
          .header p { color: #e0e7ff; font-size: 14px; margin: 10px 0 0; }
          .content { padding: 30px 20px; }
          .content p { font-size: 16px; line-height: 1.6; margin: 0 0 15px; }
          .primary-button { display: inline-block; padding: 14px 28px; background: #4f46e5; color: #ffffff !important; text-decoration: none !important; border-radius: 6px; font-size: 16px; font-weight: 600; margin: 15px 0; text-align: center; }
          .primary-button:hover { background: #4338ca; }
          .button-grid { margin: 20px 0; text-align: center; }
          .button-grid a { display: inline-block; width: 48%; margin: 1%; padding: 12px; background: #e0e7ff; color: #4f46e5 !important; text-decoration: none !important; border-radius: 6px; font-size: 14px; font-weight: 500; box-sizing: border-box; }
          .button-grid a:hover { background: #d1d5db; }
          .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px; color: #1f2937; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; }
          .footer a { color: #4f46e5; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .header { padding: 20px; }
            .header h1 { font-size: 22px; }
            .content { padding: 20px; }
            .content p { font-size: 15px; }
            .primary-button { padding: 12px 24px; font-size: 15px; }
            .button-grid a { width: 47%; margin: 1% 1%; padding: 10px; font-size: 13px; }
          }
          @media (max-width: 400px) {
            .button-grid a { width: 100%; margin: 5px 0; }
          }
        </style>
      </head>
      <body>
        <table class="container" align="center" role="presentation">
          <tr>
            <td>
              <table class="header" role="presentation">
                <tr>
                  <td align="center">
                    <h1>Welcome to DevExCode!</h1>
                    <p>Your journey to mastering coding interviews starts here.</p>
                  </td>
                </tr>
              </table>
              <table class="content" role="presentation">
                <tr>
                  <td>
                    <p>Hello ${name.trim()},</p>
                    <p>Thank you for joining DevExCode! Your account has been successfully created, and we're thrilled to have you on board.</p>
                    <p>Explore our platform to access expertly crafted resources, connect with a vibrant developer community, and elevate your technical skills.</p>
                    <p style="text-align: center;">
                      <a href="${baseUrl}/" class="primary-button" role="button" aria-label="Log in to your DevExCode account">Log In to Your Account</a>
                    </p>
                    <h2 class="section-title">Discover Our Resources</h2>
                    <p>Jump into our comprehensive tools and content designed to help you succeed:</p>
                    <div class="button-grid">
                      <a href="${baseUrl}/leetcode" role="button" aria-label="Explore Leetcode solutions">Leetcode</a>
                      <a href="${baseUrl}/system-design" role="button" aria-label="Learn System Design">System Design</a>
                      <a href="${baseUrl}/interview" role="button" aria-label="Prepare for Interviews">Interview</a>
                      <a href="${baseUrl}/learn10" role="button" aria-label="Access QuickLearn lessons">QuickLearn</a>
                      <a href="${baseUrl}/daily-term" role="button" aria-label="Discover TechBit daily terms">TechBit</a>
                      <a href="${baseUrl}/micro-dev-tips" role="button" aria-label="Read Micro Dev Tips">DevTips</a>
                      <a href="${baseUrl}/tech-battles" role="button" aria-label="Engage in Tech Battles">Tech Battles</a>
                      <a href="${baseUrl}/potd" role="button" aria-label="Solve Problem of the Day">POTD</a>
                      <a href="${baseUrl}/community" role="button" aria-label="Join the DevExCode Community">Community</a>
                    </div>
                    <p>Have questions or need help? Contact us at <a href="mailto:support@devexcode.com" style="color: #4f46e5; text-decoration: none;">support@devexcode.com</a>.</p>
                  </td>
                </tr>
              </table>
              <table class="footer" role="presentation">
                <tr>
                  <td align="center">
                    <p>&copy; 2025 DevExCode. All rights reserved.</p>
                    <p>
                      <a href="https://devexcode.com">Visit our website</a> | 
                      <a href="https://devexcode.com/contact">Contact Us</a> | 
                      <a href="https://devexcode.com/privacy">Privacy Policy</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email sending timed out after 10 seconds')), 10000)
      ),
    ]);
    
  } catch (error) {
    console.error('sendWelcomeEmail: Error sending email:', error.message);
    throw error;
  }
}