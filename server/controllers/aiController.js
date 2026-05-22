import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';
import { generateInsights, generateSmartTasks, summarizeText } from '../services/aiService.js';

export const summarize = asyncHandler(async (req, res) => {
  res.json({ summary: await summarizeText(req.body.text) });
});

export const insights = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const [tasks, activities] = await Promise.all([
    Task.find({ workspace: req.params.workspaceId }),
    ActivityLog.find({ workspace: req.params.workspaceId }).limit(20)
  ]);
  res.json({ insights: await generateInsights({ tasks, activities }) });
});

export const smartTasks = asyncHandler(async (req, res) => {
  res.json({ plan: await generateSmartTasks(req.body.prompt) });
});
