// pages/api/progress/update.js
import jwt from 'jsonwebtoken';
import { withDb } from '../../middleware/db';

export default withDb(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify JWT token
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key', { algorithms: ['HS256'] });
  } catch (error) {
    
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { type, itemId, status, notes } = req.body;

  // Server-side validation
  if (!type || !itemId || !status) {
    return res.status(400).json({ message: 'Type, itemId, and status are required' });
  }
  const parsedItemId = parseInt(itemId, 10);
  if (isNaN(parsedItemId)) {
    return res.status(400).json({ message: 'Invalid itemId format' });
  }
  const validTypes = ['leetcode', 'systemdesign'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }
  const validStatuses = ['viewed', 'solved', 'tagged', 'in-progress'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  
  try {
    const db = req.db;
    

    const progress = await db.collection('progress').findOneAndUpdate(
      { userId: decoded.userId, type, itemId: parsedItemId },
      {
        $set: {
          status,
          notes: notes || '',
          lastUpdated: new Date(),
          attemptCount: { $inc: 1 },
        },
        $setOnInsert: { userId: decoded.userId },
      },
      { upsert: true, returnDocument: 'after', projection: { _id: 0, userId: 0 } } // Limit returned fields
    );

    if (!progress.value) {
      throw new Error('Update failed');
    }

    
    return res.status(200).json({ message: 'Progress updated', progress: progress.value });
  } catch (error) {
    console.error('Progress Update: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    if (error.code === 11000) { // Handle duplicate key error if index exists
      return res.status(400).json({ message: 'Duplicate entry detected' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});