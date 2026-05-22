import { connectDB } from '../config/db.js';
import ActivityLog from '../models/ActivityLog.js';
import FileAsset from '../models/FileAsset.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';

await connectDB();

await Promise.all([
  ActivityLog.deleteMany({}),
  FileAsset.deleteMany({}),
  Message.deleteMany({}),
  Notification.deleteMany({}),
  Task.deleteMany({}),
  Workspace.deleteMany({}),
  User.deleteMany({})
]);

const users = await User.create([
  {
    name: 'Aditya Pareek',
    email: 'aditya@collabsphere.dev',
    password: 'Password123',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Aditya%20Pareek',
    bio: 'Full-stack builder focused on realtime SaaS products.',
    skills: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    status: 'online'
  },
  {
    name: 'Maya Chen',
    email: 'maya@collabsphere.dev',
    password: 'Password123',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Maya%20Chen',
    skills: ['Product', 'Analytics'],
    status: 'online'
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan@collabsphere.dev',
    password: 'Password123',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Rohan%20Mehta',
    skills: ['Backend', 'Security'],
    status: 'busy'
  }
]);

const workspace = await Workspace.create({
  name: 'NovaOps Command Center',
  slug: 'novaops-command-center',
  description: 'Product, engineering, and design execution hub.',
  owner: users[0]._id,
  inviteCode: 'NOVA24',
  members: [
    { user: users[0]._id, role: 'owner' },
    { user: users[1]._id, role: 'admin' },
    { user: users[2]._id, role: 'member' }
  ],
  channels: [{ name: 'general', kind: 'group', members: users.map((user) => user._id) }]
});

const tasks = await Task.create([
  { workspace: workspace._id, title: 'Ship workspace invitation flow', status: 'todo', priority: 'high', progress: 24, labels: ['Growth', 'Backend'], dueDate: new Date(Date.now() + 86400000 * 3), assignees: [users[1]._id], createdBy: users[0]._id },
  { workspace: workspace._id, title: 'Polish realtime typing indicators', status: 'in-progress', priority: 'medium', progress: 58, labels: ['Realtime', 'UX'], dueDate: new Date(Date.now() + 86400000 * 4), assignees: [users[2]._id], createdBy: users[0]._id },
  { workspace: workspace._id, title: 'Review file preview security rules', status: 'review', priority: 'urgent', progress: 86, labels: ['Security'], dueDate: new Date(Date.now() + 86400000), assignees: [users[0]._id], createdBy: users[2]._id },
  { workspace: workspace._id, title: 'Launch productivity insights dashboard', status: 'completed', priority: 'high', progress: 100, labels: ['AI', 'Analytics'], dueDate: new Date(Date.now() - 86400000 * 2), assignees: [users[1]._id], createdBy: users[0]._id }
]);

await Message.create([
  { workspace: workspace._id, sender: users[1]._id, content: 'The invite flow API is ready. I added role defaults and activity logging.', channel: 'general' },
  { workspace: workspace._id, sender: users[2]._id, content: '@Aditya can you check the typing event debounce before the demo?', channel: 'general' }
]);

await FileAsset.create({
  workspace: workspace._id,
  uploadedBy: users[0]._id,
  originalName: 'Sprint-Roadmap.pdf',
  url: 'https://example.com/sprint-roadmap.pdf',
  mimeType: 'application/pdf',
  size: 740000,
  previewType: 'document'
});

await ActivityLog.create([
  { workspace: workspace._id, actor: users[0]._id, type: 'workspace_created', title: 'Aditya created NovaOps Command Center' },
  { workspace: workspace._id, actor: users[1]._id, type: 'task_created', title: `Maya created "${tasks[0].title}"` },
  { workspace: workspace._id, actor: users[2]._id, type: 'message_sent', title: 'Rohan sent a message in #general' }
]);

await Notification.create({
  user: users[0]._id,
  workspace: workspace._id,
  type: 'mention',
  title: 'Rohan mentioned you',
  body: 'Can you check the typing event debounce before the demo?'
});

console.log('Seed complete');
console.log('Demo login: aditya@collabsphere.dev / Password123');
process.exit(0);
