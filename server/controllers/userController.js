import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar', 'bio', 'skills', 'status'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: req.user });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  const workspaces = await Workspace.find({ 'members.user': req.params.id }).select('name logo theme');
  res.json({ user, workspaces });
});
