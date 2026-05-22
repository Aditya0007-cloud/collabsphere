import Workspace from '../models/Workspace.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { createActivity } from '../services/activityService.js';

const makeInviteCode = () => Math.random().toString(36).slice(2, 9).toUpperCase();
const makeSlug = (name) => `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

export const listWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({ 'members.user': req.user._id })
    .populate('members.user', 'name email avatar status')
    .sort('-updatedAt');
  res.json({ workspaces });
});

export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description, accent } = req.body;
  const workspace = await Workspace.create({
    name,
    description,
    slug: makeSlug(name),
    owner: req.user._id,
    inviteCode: makeInviteCode(),
    theme: { accent: accent || '#4f46e5', mode: 'system' },
    members: [{ user: req.user._id, role: 'owner' }],
    channels: [{ name: 'general', kind: 'group', members: [req.user._id] }]
  });

  await createActivity({ workspace: workspace._id, actor: req.user._id, type: 'workspace_created', title: `${req.user.name} created ${workspace.name}` });
  res.status(201).json({ workspace });
});

export const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOne({ _id: req.params.id, 'members.user': req.user._id })
    .populate('members.user', 'name email avatar status bio skills stats');
  if (!workspace) throw new ApiError(404, 'Workspace not found');
  res.json({ workspace });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOne({ _id: req.params.id, 'members.user': req.user._id });
  if (!workspace) throw new ApiError(404, 'Workspace not found');
  const member = workspace.members.find((item) => item.user.toString() === req.user._id.toString());
  if (!['owner', 'admin'].includes(member.role)) throw new ApiError(403, 'Only workspace admins can update settings');

  const allowed = ['name', 'description', 'theme'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) workspace[key] = req.body[key];
  });
  await workspace.save();
  res.json({ workspace });
});

export const joinWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findOne({ inviteCode: req.body.inviteCode?.toUpperCase() });
  if (!workspace) throw new ApiError(404, 'Invalid invite code');

  const alreadyMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString());
  if (!alreadyMember) {
    workspace.members.push({ user: req.user._id, role: 'member' });
    workspace.channels[0]?.members.push(req.user._id);
    await workspace.save();
    await createActivity({ workspace: workspace._id, actor: req.user._id, type: 'member_joined', title: `${req.user.name} joined ${workspace.name}` });
    await Notification.create({
      user: workspace.owner,
      workspace: workspace._id,
      type: 'system',
      title: 'New teammate joined',
      body: `${req.user.name} joined ${workspace.name}`
    });
  }

  res.json({ workspace });
});
