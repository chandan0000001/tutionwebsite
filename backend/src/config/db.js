import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: !ENV.isProduction, // In production, indexes should be created via migrations or managed separately
    });

    isConnected = true;
    const host = conn.connection.host;
    const dbName = conn.connection.name;
    console.log(`[DB] Connected successfully to MongoDB at host: ${host}, database: ${dbName}`);
    return conn;
  } catch (error) {
    console.error('[DB] Connection error:', error.message);
    throw error;
  }
}

export async function disconnectDB() {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[DB] Disconnected gracefully from MongoDB.');
  } catch (error) {
    console.error('[DB] Error during disconnection:', error.message);
  }
}
