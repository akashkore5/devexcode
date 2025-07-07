import { getDb, getMongoClient } from '../lib/mongodb';

let cachedDb = null;
let cachedClient = null;

export function withDb(handler) {
  return async (req, res) => {
    try {
      if (!cachedDb || !cachedClient) {
        
        cachedClient = await getMongoClient();
        cachedDb = await getDb();
        
        
      }
      req.db = cachedDb; // For routes using Db instance
      req.mongoClient = cachedClient; // For MongoDBAdapter
      
      return await handler(req, res);
    } catch (error) {
      console.error('withDb: Failed to connect to database:', error.message);
      res.status(500).json({ error: 'Database connection failed' });
    }
  };
}