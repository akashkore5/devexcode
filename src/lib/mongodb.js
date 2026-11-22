// lib/mongodb.js
import { MongoClient } from 'mongodb';

// Everything here is lazy on purpose.
//
// This module used to read MONGODB_URI, throw if it was unset, construct a
// MongoClient and start connecting — all at import time. Next imports every
// route module while collecting page data, so a production build could not
// complete without a reachable database, and each build opened real
// connections (with 5 retries and exponential backoff) before rendering a
// single page. CI had no database, so the build failed outright on
// /api/auth/[...nextauth].
//
// The connection is now established on first use. A build that never calls
// getDb() never touches Mongo, and a missing URI surfaces as a request-time
// error on the routes that actually need it instead of a build failure.

const POOL_CONFIG = {
  development: {
    minPoolSize: 2,
    maxPoolSize: 10,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  },
  production: {
    minPoolSize: 10,
    maxPoolSize: 50,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
  },
};

const DB_NAME = 'leetcodesolve';

let client;
let clientPromise;

function createClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  const config = POOL_CONFIG[process.env.NODE_ENV] || POOL_CONFIG.development;

  return new MongoClient(uri, {
    ...config,
    retryWrites: true,
    retryReads: true,
  });
}

// Exponential backoff retry logic
async function connectWithRetry(mongoClient, maxRetries = 5, baseDelay = 2000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`MongoDB: Attempting connection (attempt ${attempt}/${maxRetries})`);
      await mongoClient.connect();
      return mongoClient;
    } catch (error) {
      lastError = error;
      console.error(`MongoDB: Connection attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error('MongoDB: All connection attempts failed');
        throw new Error(`Database connection failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
    }
  }
  throw lastError;
}

function getClientPromise() {
  // In development the module is re-evaluated on every hot reload, so the
  // promise is parked on globalThis to avoid leaking a connection pool per edit.
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = createClient();
      global._mongoClientPromise = connectWithRetry(client);
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    client = createClient();
    clientPromise = connectWithRetry(client).catch((error) => {
      // Clear the cached rejection so the next request retries rather than
      // replaying the first failure for the life of the process.
      clientPromise = undefined;
      client = undefined;
      throw error;
    });
  }
  return clientPromise;
}

export async function getMongoClient() {
  try {
    return await getClientPromise();
  } catch (error) {
    console.error('MongoDB: Failed to fetch client:', error.message);
    throw new Error('Unable to connect to database');
  }
}

export async function getDb() {
  try {
    const connectedClient = await getMongoClient();
    const db = connectedClient.db(DB_NAME);
    await db.command({ ping: 1 }).catch((error) => {
      console.error('MongoDB: Ping failed:', error.message);
      throw new Error('Database ping failed');
    });
    return db;
  } catch (error) {
    console.error('MongoDB: Failed to fetch database:', error.message);
    throw new Error('Unable to access database');
  }
}

export async function closeMongoClient() {
  try {
    if (client) await client.close();
  } catch (error) {
    console.error('MongoDB: Error closing client:', error.message);
  } finally {
    client = undefined;
    clientPromise = undefined;
    if (process.env.NODE_ENV === 'development') global._mongoClientPromise = undefined;
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
