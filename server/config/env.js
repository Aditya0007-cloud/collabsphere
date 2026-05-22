import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const splitOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5188';
const clientOrigins = splitOrigins(process.env.CLIENT_ORIGINS || clientUrl);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5011),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CLIENT_URL: z.string().url().default('http://localhost:5188'),
  CLIENT_ORIGINS: z.string().optional(),
  MONGO_URI: z
    .string()
    .min(1, 'MONGO_URI is required')
    .refine((value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'), 'MONGO_URI must start with mongodb:// or mongodb+srv://'),
  JWT_SECRET: z.string().min(24, 'JWT_SECRET must be at least 24 characters long').default('development-collabsphere-secret'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
});

const parsedEnv = envSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_ORIGINS: process.env.CLIENT_ORIGINS,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collabsphere',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
});

if (!parsedEnv.success) {
  console.error('Invalid environment configuration');
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

const values = parsedEnv.data;

export const env = {
  port: values.PORT,
  nodeEnv: values.NODE_ENV,
  clientUrl: values.CLIENT_URL,
  clientOrigins,
  mongoUri: values.MONGO_URI,
  jwtSecret: values.JWT_SECRET,
  jwtExpiresIn: values.JWT_EXPIRES_IN,
  openaiApiKey: values.OPENAI_API_KEY || '',
  geminiApiKey: values.GEMINI_API_KEY || '',
  cloudinary: {
    cloudName: values.CLOUDINARY_CLOUD_NAME || '',
    apiKey: values.CLOUDINARY_API_KEY || '',
    apiSecret: values.CLOUDINARY_API_SECRET || ''
  }
};
