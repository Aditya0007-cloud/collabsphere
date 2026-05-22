import mongoose from 'mongoose';
import { env } from './env.js';

const describeMongoUri = (uri = '') => {
  if (!uri) return { present: false };

  try {
    const parsed = new URL(uri);
    return {
      present: true,
      protocol: parsed.protocol,
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, '') || '(missing)',
      username: parsed.username || '(missing)'
    };
  } catch (error) {
    return {
      present: true,
      invalid: true,
      startsWith: uri.slice(0, 18)
    };
  }
};

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    console.log('MongoDB config:', describeMongoUri(env.mongoUri));
    const connection = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (error.reason) console.error('MongoDB reason:', error.reason);
    process.exit(1);
  }
};
