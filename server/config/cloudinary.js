import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

const configured = Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

if (configured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret
  });
}

export const isCloudinaryConfigured = () => configured;

export const uploadToCloudinary = async (filePath, options = {}) => {
  if (!configured) return null;
  return cloudinary.uploader.upload(filePath, {
    folder: 'collabsphere',
    resource_type: 'auto',
    ...options
  });
};
