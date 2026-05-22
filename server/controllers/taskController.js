import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';
import { createActivity } from '../services/activityService.js';
import { emitToWorkspace } from '../utils/emitters.js';

const populateTask = (query) => query.populate('assignees', 'name avatar email').populate('createdBy', 'name avatar').populate('comments.author', 'name avatar');

export const listTasks = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const tasks = await populateTask(Task.find({ workspace: req.params.workspaceId }).sort('status -updatedAt'));
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const task = await Task.create({ ...req.body, workspace: req.params.workspaceId, createdBy: req.user._id });
  const populated = await populateTask(Task.findById(task._id));

  await createActivity({ workspace: req.params.workspaceId, actor: req.user._id, type: 'task_created', title: `${req.user.name} created task "${task.title}"`, metadata: { taskId: task._id } });
  await Promise.all((task.assignees || []).map((user) => Notification.create({
    user,
    workspace: req.params.workspaceId,
    type: 'task',
    title: 'New task assigned',
    body: task.title,
    href: `/workspaces/${req.params.workspaceId}/tasks/${task._id}`
  })));
  emitToWorkspace(req.params.workspaceId, 'task:created', populated);
  res.status(201).json({ task: populated });
});

export const updateTask = asyncHandler(async (req, res) => {
  const existing = await Task.findById(req.params.taskId);
  if (!existing) throw new ApiError(404, 'Task not found');
  await getMemberWorkspace(existing.workspace, req.user._id);
  const wasCompleted = existing.status === 'completed';

  Object.assign(existing, req.body);
  if (existing.status === 'completed') existing.progress = 100;
  await existing.save();

  const populated = await populateTask(Task.findById(existing._id));
  const type = !wasCompleted && existing.status === 'completed' ? 'task_completed' : 'task_updated';
  await createActivity({ workspace: existing.workspace, actor: req.user._id, type, title: `${req.user.name} ${type === 'task_completed' ? 'completed' : 'updated'} "${existing.title}"`, metadata: { taskId: existing._id } });
  emitToWorkspace(existing.workspace.toString(), 'task:updated', populated);
  res.json({ task: populated });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  await getMemberWorkspace(task.workspace, req.user._id);
  await task.deleteOne();
  emitToWorkspace(task.workspace.toString(), 'task:deleted', { taskId: task._id });
  res.json({ message: 'Task deleted' });
});

export const addTaskComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  await getMemberWorkspace(task.workspace, req.user._id);
  task.comments.push({ author: req.user._id, body: req.body.body });
  await task.save();
  const populated = await populateTask(Task.findById(task._id));
  emitToWorkspace(task.workspace.toString(), 'task:updated', populated);
  res.status(201).json({ task: populated });
});
