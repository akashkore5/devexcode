import bcrypt from 'bcrypt';
import { withDb } from '../../../middleware/db';
import { ObjectId } from 'mongodb';
import { sendWelcomeEmail } from '../../../lib/email';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, mobile, password } = req.body;

  // Server-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(400).json({ message: 'Password must be 8+ characters with uppercase, lowercase, number, and special character' });
  }
  if (!name || !/^[a-zA-Z\s]{2,50}$/.test(name)) {
    return res.status(400).json({ message: 'Name must be 2–50 alphabetic characters' });
  }
  if (mobile && !/^\+?[\d-]{7,15}$/.test(mobile)) {
    return res.status(400).json({ message: 'Invalid mobile number' });
  }

  
  try {
    const db = req.db;
    

    // Ensure 'users' collection exists and create index
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      
      await db.createCollection('users');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      
    } else if (!collections.some(col => col.name === 'users' && col.options?.unique)) {
      const indexes = await db.collection('users').indexes();
      const emailIndex = indexes.find(idx => idx.key.email === 1 && idx.unique);
      if (!emailIndex) {
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        
      }
    }

    const existingUser = await db.collection('users').findOne(
      { email: email.trim().toLowerCase() },
      { projection: { email: 1 } }
    );
    if (existingUser) {
      
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      _id: new ObjectId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile ? mobile.trim() : null,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await db.collection('users').insertOne(user);

    // Send welcome email
    await sendWelcomeEmail(email, name);

    
    return res.status(201).json({ message: 'User registered successfully', userId: user._id.toString() });
  } catch (error) {
    console.error('Register: Error:', error.message, error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    if (error.message.includes('Email sending timed out')) {
      return res.status(500).json({ message: 'Failed to send welcome email due to timeout, but account was created.' });
    }
    return res.status(500).json({ message: `Registration failed: ${error.message}` });
  }
});