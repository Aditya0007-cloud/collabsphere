import { env } from '../config/env.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists'
    });
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    details: error.details || undefined,
    stack: env.nodeEnv === 'production' ? undefined : error.stack
  });
};
