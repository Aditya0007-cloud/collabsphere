import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import validator from 'validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { signRefreshToken, signToken, verifyToken } from '../utils/jwt.js';
import { createActivity } from '../services/activityService.js';
import { env } from '../config/env.js';

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  skills: user.skills,
  role: user.role,
  stats: user.stats
});

const makeInviteCode = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const makeSlug = (name) => `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
const refreshCookieName = 'collabsphere_refresh';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/'
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const normalizeName = (name = '') => name.trim().replace(/\s+/g, ' ');

const validatePassword = (password = '') => {
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number';
  return null;
};

const issueSession = (res, user) => {
  const accessToken = signToken(user._id);
  const refreshToken = signRefreshToken(user._id, user.refreshTokenVersion || 0);
  res.cookie(refreshCookieName, refreshToken, cookieOptions);
  return accessToken;
};

const clearSessionCookie = (res) => {
  res.clearCookie(refreshCookieName, { ...cookieOptions, maxAge: undefined });
};

export const signup = asyncHandler(async (req, res) => {
  const name = normalizeName(req.body.name);
  const email = normalizeEmail(req.body.email);
  const password = req.body.password || '';

  if (!name || name.length < 2) throw new ApiError(400, 'Please enter your full name');
  if (!validator.isEmail(email)) throw new ApiError(400, 'Please enter a valid email address');

  const passwordError = validatePassword(password);
  if (passwordError) throw new ApiError(400, passwordError);

  const existing = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  let user;
  try {
    user = await User.create({ name, email, password, status: 'offline' });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, 'An account with this email already exists');
    throw error;
  }

  const workspace = await Workspace.create({
    name: `${name.split(' ')[0]}'s Workspace`,
    slug: makeSlug(`${name}-workspace`),
    owner: user._id,
    inviteCode: makeInviteCode(),
    members: [{ user: user._id, role: 'owner' }],
    channels: [{ name: 'general', kind: 'group', members: [user._id] }]
  });

  await createActivity({
    workspace: workspace._id,
    actor: user._id,
    type: 'workspace_created',
    title: `${user.name} created ${workspace.name}`
  });

  res.status(201).json({
    message: 'Account created successfully. Please log in to continue.',
    user: { id: user._id, name: user.name, email: user.email },
    workspace: { id: workspace._id, name: workspace.name },
    next: 'login'
  });
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password || '';

  if (!validator.isEmail(email)) throw new ApiError(400, 'Please enter a valid email address');
  if (!password) throw new ApiError(400, 'Password is required');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.status = 'online';
  user.lastSeen = new Date();
  user.lastLoginAt = new Date();
  await user.save();

  res.json({ token: issueSession(res, user), user: serializeUser(user) });
});

export const refreshSession = asyncHandler(async (req, res) => {
  const token = req.cookies?.[refreshCookieName];
  if (!token) throw new ApiError(401, 'Refresh session missing');

  const decoded = verifyToken(token);
  if (decoded.type !== 'refresh') throw new ApiError(401, 'Invalid refresh session');

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'User no longer exists');
  if ((user.refreshTokenVersion || 0) !== decoded.tokenVersion) {
    clearSessionCookie(res);
    throw new ApiError(401, 'Refresh session expired');
  }

  user.refreshTokenVersion += 1;
  user.status = 'online';
  user.lastSeen = new Date();
  await user.save();

  res.json({ token: issueSession(res, user), user: serializeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { status: 'offline', lastSeen: new Date() });
  clearSessionCookie(res);
  res.json({ message: 'Logged out successfully' });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { refreshTokenVersion: 1 },
    status: 'offline',
    lastSeen: new Date()
  });
  clearSessionCookie(res);
  res.json({ message: 'Logged out from all devices' });
});
