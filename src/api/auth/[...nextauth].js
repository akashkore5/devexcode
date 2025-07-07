import NextAuth from 'next-auth';
import { withDb } from '../../../middleware/db';
import { getAuthOptions } from '../../../lib/auth';

async function authHandler(req, res) {
  
  try {
    const options = await getAuthOptions({ db: req.db, mongoClient: req.mongoClient });
    return await NextAuth(req, res, options);
  } catch (error) {
    console.error('NextAuth: Handler error:', error.message, error.stack);
    res.status(503).json({
      error: 'Service temporarily unavailable. Please try again later.',
      retryAfter: 30,
    });
  }
}

export default withDb(authHandler);