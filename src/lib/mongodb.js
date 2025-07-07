// lib/mongodb.js
import { MongoClient } from 'mongodb';

// Load environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable');
}
console.log('MONGODB_URI:', uri ? uri.replace(/:[^@]+@/, ':****@') : 'Undefined');

// Configuration based on environment
const config = {
  development: {
    minPoolSize: 2,
    maxPoolSize: 10,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  },
  production: {
    minPoolSize: 10,
    maxPoolSize: 50, // Adjustable based on load
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
  },
}[process.env.NODE_ENV || 'development'];

const client = new MongoClient(uri, {
  ...config,
  retryWrites: true,
  retryReads: true,
});

// Singleton client promise
let clientPromise;
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectWithRetry(client);
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connectWithRetry(client);
}

// Exponential backoff retry logic
async function connectWithRetry(client, maxRetries = 5, baseDelay = 2000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`MongoDB: Attempting connection (attempt ${attempt}/${maxRetries})`);
      await client.connect();
      
      return client;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB: Connection attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error('MongoDB: All connection attempts failed');
        throw new Error(`Database connection failed after ${maxRetries} attempts: ${error.message}`);
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

// Export a factory function to get the client or database
export async function getMongoClient() {
  try {
    
    const connectedClient = await clientPromise;
    
    return connectedClient;
  } catch (error) {
    console.error('MongoDB: Failed to fetch client:', error.message, error.stack);
    throw new Error('Unable to connect to database');
  }
}

export async function getDb() {
  try {
    
    const client = await getMongoClient();
    const db = client.db('leetcodesolve');
    await db.command({ ping: 1 }).catch((error) => {
      console.error('MongoDB: Ping failed:', error.message);
      throw new Error('Database ping failed');
    });
    
    return db;
  } catch (error) {
    console.error('MongoDB: Failed to fetch database:', error.message, error.stack);
    throw new Error('Unable to access database');
  }
}

// Optional: Export a cleanup function for manual control
export async function closeMongoClient() {
  try {
    
    await client.close();
    
  } catch (error) {
    console.error('MongoDB: Error closing client:', error.message);
  }
}

// Register SIGINT listener only once using a global flag
const SIGINT_REGISTERED = Symbol.for('mongo.sigint.registered');
if (!global[SIGINT_REGISTERED]) {
  global[SIGINT_REGISTERED] = true;
  process.on('SIGINT', async () => {
    
    await closeMongoClient();
    process.exit(0);
  });
}