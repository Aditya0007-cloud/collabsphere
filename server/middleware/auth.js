import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) throw new ApiError(401, 'Authentication token missing');

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});
