import dotenv from 'dotenv';

dotenv.config();

const splitOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5188';
const clientOrigins = splitOrigins(process.env.CLIENT_ORIGINS || clientUrl);

export const env = {
  port: process.env.PORT || 5011,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl,
  clientOrigins,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabsphere',
  jwtSecret: process.env.JWT_SECRET || 'development-collabsphere-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  }
};
