import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const signRefreshToken = (userId, tokenVersion = 0) =>
  jwt.sign({ id: userId, tokenVersion, type: 'refresh' }, env.jwtSecret, { expiresIn: '30d' });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
