// pages/api/reset-password.js
import bcrypt from 'bcrypt';
import { withDb } from '../../../middleware/db';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, email, password } = req.body;

  // Server-side validation
  if (!token || !email || !password) {
    return res.status(400).json({ message: 'Token, email, and password are required' });
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(400).json({ message: 'Password must be 8+ characters with uppercase, lowercase, number, and special character' });
  }

  
  try {
    const db = req.db;
    

    const user = await db.collection('users').findOne(
      {
        email: email.trim().toLowerCase(),
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      },
      { projection: { _id: 1, email: 1, resetToken: 1, resetTokenExpiry: 1 } } // Limit fields
    );

    if (!user) {
      
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased work factor for security
    const result = await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: '', resetTokenExpiry: '' },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found or update failed');
    }

    
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    return res.status(500).json({ message: `Failed to reset password: ${error.message}` });
  }
});