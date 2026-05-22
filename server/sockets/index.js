import Message from '../models/Message.js';
import User from '../models/User.js';
import { createActivity } from '../services/activityService.js';
import { verifyToken } from '../utils/jwt.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';

const onlineUsers = new Map();

export const registerSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token missing'));
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on('connection', async (socket) => {
    onlineUsers.set(socket.user._id.toString(), socket.id);
    await User.findByIdAndUpdate(socket.user._id, { status: 'online', lastSeen: new Date() });
    io.emit('presence:update', { userId: socket.user._id, status: 'online', onlineUsers: [...onlineUsers.keys()] });

    socket.on('workspace:join', async ({ workspaceId }) => {
      await getMemberWorkspace(workspaceId, socket.user._id);
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on('typing:start', ({ workspaceId, channel = 'general' }) => {
      socket.to(`workspace:${workspaceId}`).emit('typing:start', { user: socket.user, channel });
    });

    socket.on('typing:stop', ({ workspaceId, channel = 'general' }) => {
      socket.to(`workspace:${workspaceId}`).emit('typing:stop', { userId: socket.user._id, channel });
    });

    socket.on('message:send', async ({ workspaceId, content, channel = 'general', type = 'group', recipient }) => {
      await getMemberWorkspace(workspaceId, socket.user._id);
      const message = await Message.create({
        workspace: workspaceId,
        sender: socket.user._id,
        content,
        channel,
        type,
        recipient,
        readBy: [socket.user._id]
      });
      const populated = await Message.findById(message._id).populate('sender', 'name avatar status').populate('recipient', 'name avatar status');
      await createActivity({ workspace: workspaceId, actor: socket.user._id, type: 'message_sent', title: `${socket.user.name} sent a message in #${channel}` });
      io.to(`workspace:${workspaceId}`).emit('message:new', populated);
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(socket.user._id.toString());
      await User.findByIdAndUpdate(socket.user._id, { status: 'offline', lastSeen: new Date() });
      io.emit('presence:update', { userId: socket.user._id, status: 'offline', onlineUsers: [...onlineUsers.keys()] });
    });
  });
};
