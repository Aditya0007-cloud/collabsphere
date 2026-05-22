import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';
import { createActivity } from '../services/activityService.js';
import { emitToWorkspace } from '../utils/emitters.js';

const populateMessage = (query) => query.populate('sender', 'name avatar status').populate('recipient', 'name avatar status').populate('mentions', 'name avatar');

const extractMentions = async (content) => {
  const names = [...content.matchAll(/@([a-zA-Z0-9_.-]+)/g)].map((match) => match[1].toLowerCase());
  if (!names.length) return [];
  const users = await User.find({ name: { $in: names.map((name) => new RegExp(`^${name}$`, 'i')) } }).select('_id');
  return users.map((user) => user._id);
};

export const listMessages = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const query = { workspace: req.params.workspaceId };
  if (req.query.channel) query.channel = req.query.channel;
  const messages = await populateMessage(Message.find(query).sort('-createdAt').limit(60)).lean();
  res.json({ messages: messages.reverse() });
});

export const createMessage = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const mentions = await extractMentions(req.body.content || '');
  const message = await Message.create({
    workspace: req.params.workspaceId,
    sender: req.user._id,
    channel: req.body.channel || 'general',
    type: req.body.type || 'group',
    recipient: req.body.recipient,
    content: req.body.content,
    mentions,
    readBy: [req.user._id]
  });
  await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.messagesSent': 1 } });
  const populated = await populateMessage(Message.findById(message._id));
  await createActivity({ workspace: req.params.workspaceId, actor: req.user._id, type: 'message_sent', title: `${req.user.name} sent a message in #${message.channel}` });

  await Promise.all(mentions.map((user) => Notification.create({
    user,
    workspace: req.params.workspaceId,
    type: 'mention',
    title: `${req.user.name} mentioned you`,
    body: req.body.content.slice(0, 120)
  })));

  emitToWorkspace(req.params.workspaceId, 'message:new', populated);
  res.status(201).json({ message: populated });
});

export const pinMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);
  if (!message) throw new ApiError(404, 'Message not found');
  await getMemberWorkspace(message.workspace, req.user._id);
  message.pinned = !message.pinned;
  await message.save();
  const populated = await populateMessage(Message.findById(message._id));
  emitToWorkspace(message.workspace.toString(), 'message:updated', populated);
  res.json({ message: populated });
});
