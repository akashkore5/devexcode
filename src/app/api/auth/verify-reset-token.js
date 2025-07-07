// pages/api/verify-reset-token.js
import { withDb } from '../../../middleware/db';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, email } = req.body;

  // Server-side validation
  if (!token || !email) {
    return res.status(400).json({ message: 'Token and email are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: 'Invalid email address' });
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

    
    return res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Verify Reset Token: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    return res.status(500).json({ message: `Failed to verify token: ${error.message}` });
  }
});