// pages/api/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { withDb } from '../../middleware/db';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Server-side validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  
  try {
    const db = req.db;
    

    const user = await db.collection('users').findOne(
      { email: email.trim().toLowerCase() },
      { projection: { password: 1, _id: 1, email: 1 } } // Limit fields
    );

    if (!user) {
      
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'default-secret-key',
      {
        expiresIn: '1h',
        algorithm: 'HS256', // Explicitly specify algorithm
      }
    );

    res.setHeader(
      'Set-Cookie',
      `authToken=${token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure' : ''
      }`
    );

    
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});