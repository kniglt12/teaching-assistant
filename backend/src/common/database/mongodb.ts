import { MongoClient, Db } from 'mongodb';
import logger from '../logger';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongoDB = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB || 'teaching_assistant';

    client = new MongoClient(uri);
    await client.connect();

    db = client.db(dbName);

    logger.info('MongoDB connected successfully');
    return db;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('MongoDB not initialized. Call connectMongoDB() first.');
  }
  return db;
};

export const getCollection = (name: string) => {
  const database = getDb();
  return database.collection(name);
};

export default {
  connectMongoDB,
  getDb,
  getCollection,
};
