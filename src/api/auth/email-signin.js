// pages/api/signin.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { withDb } from '../../../middleware/db';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  
  try {
    const db = req.db;
    

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await db.collection('users').findOne(
      { email },
      { projection: { password: 1, email: 1, name: 1 } } // Limit fields
    );
    if (!user) {
      
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, id: user._id.toString() },
      process.env.JWT_SECRET || 'm9x8Zf3kQw7rT2pL5vYcN4jH6bK8dM0nX1qW2eR3tU=',
      {
        expiresIn: '7d',
        algorithm: 'HS256', // Explicitly specify algorithm
      }
    );

    
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; ${
        process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Lax' : ''
      }`,
    ]);
    return res.status(200).json({ user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Sign-in: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    return res.status(500).json({ message: `Sign-in failed: ${error.message}` });
  }
});