import Task from '../models/Task.js';
import Message from '../models/Message.js';
import FileAsset from '../models/FileAsset.js';
import ActivityLog from '../models/ActivityLog.js';
import Workspace from '../models/Workspace.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const workspace = await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const [tasks, messages, files, activities] = await Promise.all([
    Task.find({ workspace: workspace._id }),
    Message.countDocuments({ workspace: workspace._id }),
    FileAsset.countDocuments({ workspace: workspace._id }),
    ActivityLog.find({ workspace: workspace._id }).populate('actor', 'name avatar').sort('-createdAt').limit(8)
  ]);

  const byStatus = ['todo', 'in-progress', 'review', 'completed'].map((status) => ({
    name: status.replace('-', ' '),
    value: tasks.filter((task) => task.status === status).length
  }));

  const priority = ['low', 'medium', 'high', 'urgent'].map((item) => ({
    name: item,
    value: tasks.filter((task) => task.priority === item).length
  }));

  const upcoming = tasks
    .filter((task) => task.dueDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6);

  res.json({
    metrics: {
      activeUsers: workspace.members.length,
      completedTasks: tasks.filter((task) => task.status === 'completed').length,
      pendingTasks: tasks.filter((task) => task.status !== 'completed').length,
      messages,
      files
    },
    charts: { byStatus, priority },
    upcoming,
    recentActivities: activities
  });
});
