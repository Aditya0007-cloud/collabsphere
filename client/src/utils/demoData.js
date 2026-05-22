export const demoUser = {
  id: 'demo-user',
  name: 'Aditya Pareek',
  email: 'aditya@collabsphere.dev',
  avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Aditya%20Pareek',
  bio: 'Full-stack builder focused on realtime SaaS products.',
  skills: ['React', 'Node.js', 'MongoDB', 'Realtime UX'],
  stats: { tasksCompleted: 32, messagesSent: 248, filesShared: 19 }
};

export const demoWorkspace = {
  _id: 'workspace-demo',
  name: 'NovaOps Command Center',
  description: 'Product, engineering, and design execution hub.',
  inviteCode: 'NOVA24',
  theme: { accent: '#4f46e5', mode: 'system' },
  members: [
    { user: demoUser, role: 'owner' },
    { user: { id: 'u2', name: 'Maya Chen', email: 'maya@nova.dev', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Maya%20Chen', status: 'online' }, role: 'admin' },
    { user: { id: 'u3', name: 'Rohan Mehta', email: 'rohan@nova.dev', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Rohan%20Mehta', status: 'busy' }, role: 'member' },
    { user: { id: 'u4', name: 'Lina Park', email: 'lina@nova.dev', avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Lina%20Park', status: 'offline' }, role: 'member' }
  ]
};

export const demoTasks = [
  { _id: 't1', title: 'Ship workspace invitation flow', description: 'Invite code, role selection, and onboarding checklist.', status: 'todo', priority: 'high', dueDate: '2026-05-24', progress: 24, labels: ['Growth', 'Backend'], assignees: [demoWorkspace.members[1].user] },
  { _id: 't2', title: 'Polish realtime typing indicators', description: 'Presence-aware channel status with throttled socket events.', status: 'in-progress', priority: 'medium', dueDate: '2026-05-25', progress: 58, labels: ['Realtime', 'UX'], assignees: [demoWorkspace.members[2].user] },
  { _id: 't3', title: 'Review file preview security rules', description: 'Harden mime filtering and public download behavior.', status: 'review', priority: 'urgent', dueDate: '2026-05-22', progress: 86, labels: ['Security'], assignees: [demoWorkspace.members[0].user] },
  { _id: 't4', title: 'Launch productivity insights dashboard', description: 'Charts, activity density, and AI-generated suggestions.', status: 'completed', priority: 'high', dueDate: '2026-05-19', progress: 100, labels: ['AI', 'Analytics'], assignees: [demoWorkspace.members[3].user] },
  { _id: 't5', title: 'Create mobile navigation pass', description: 'Responsive panels, bottom actions, and compact workspace switcher.', status: 'todo', priority: 'medium', dueDate: '2026-05-28', progress: 10, labels: ['Mobile'], assignees: [demoWorkspace.members[1].user] }
];

export const demoMessages = [
  { _id: 'm1', sender: demoWorkspace.members[1].user, content: 'The invite flow API is ready. I added role defaults and activity logging.', channel: 'general', createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), pinned: true },
  { _id: 'm2', sender: demoWorkspace.members[2].user, content: '@Aditya can you check the typing event debounce before the demo?', channel: 'general', createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { _id: 'm3', sender: demoUser, content: 'Yes. I will validate it with two sessions and then update the release notes.', channel: 'general', createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() }
];

export const demoFiles = [
  { _id: 'f1', originalName: 'Sprint-Roadmap.pdf', previewType: 'document', size: 740000, uploadedBy: demoWorkspace.members[0].user, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), url: '#' },
  { _id: 'f2', originalName: 'Dashboard-Mockup.png', previewType: 'image', size: 1180000, uploadedBy: demoWorkspace.members[1].user, createdAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(), url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80' }
];

export const demoActivities = [
  { _id: 'a1', type: 'task_completed', title: 'Lina completed "Launch productivity insights dashboard"', actor: demoWorkspace.members[3].user, createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
  { _id: 'a2', type: 'message_sent', title: 'Maya sent a message in #general', actor: demoWorkspace.members[1].user, createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString() },
  { _id: 'a3', type: 'file_uploaded', title: 'Aditya shared Sprint-Roadmap.pdf', actor: demoWorkspace.members[0].user, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { _id: 'a4', type: 'member_joined', title: 'Rohan joined NovaOps Command Center', actor: demoWorkspace.members[2].user, createdAt: new Date(Date.now() - 1000 * 60 * 260).toISOString() }
];

export const demoNotifications = [
  { _id: 'n1', type: 'mention', title: 'Rohan mentioned you', body: 'Can you check the typing event debounce?', read: false, createdAt: new Date().toISOString() },
  { _id: 'n2', type: 'task', title: 'Review due tomorrow', body: 'File preview security rules needs approval.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() }
];
