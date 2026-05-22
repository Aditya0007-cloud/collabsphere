import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';
import {
  generateAssistantResponse,
  generateCollaborationRecommendations,
  generateInsights,
  generateMeetingNotes,
  generateSmartReplies,
  generateSmartTasks,
  runSlashCommand,
  summarizeText
} from '../services/aiService.js';

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

export const meetingNotes = asyncHandler(async (req, res) => {
  res.json({ notes: await generateMeetingNotes(req.body.text) });
});

export const smartReplies = asyncHandler(async (req, res) => {
  res.json({ replies: await generateSmartReplies({ thread: req.body.thread || [], userName: req.user.name }) });
});

export const assistant = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const [tasks, activities, messages] = await Promise.all([
    Task.find({ workspace: req.params.workspaceId }).sort({ updatedAt: -1 }).limit(60),
    ActivityLog.find({ workspace: req.params.workspaceId }).sort({ createdAt: -1 }).limit(30),
    Message.find({ workspace: req.params.workspaceId }).sort({ createdAt: -1 }).limit(20).populate('sender', 'name email avatar')
  ]);

  res.json({
    answer: await generateAssistantResponse({
      question: req.body.question,
      tasks,
      activities,
      messages: messages.reverse()
    })
  });
});

export const recommendations = asyncHandler(async (req, res) => {
  const workspace = await getMemberWorkspace(req.params.workspaceId, req.user._id);
  await workspace.populate('members.user', 'name email avatar status');
  const [tasks, activities] = await Promise.all([
    Task.find({ workspace: req.params.workspaceId }).sort({ updatedAt: -1 }).limit(60),
    ActivityLog.find({ workspace: req.params.workspaceId }).sort({ createdAt: -1 }).limit(30)
  ]);

  res.json({ recommendations: await generateCollaborationRecommendations({ tasks, activities, members: workspace.members }) });
});

export const slashCommand = asyncHandler(async (req, res) => {
  const workspace = req.body.workspaceId ? await getMemberWorkspace(req.body.workspaceId, req.user._id) : null;
  const [tasks, activities, messages] = workspace
    ? await Promise.all([
        Task.find({ workspace: workspace._id }).sort({ updatedAt: -1 }).limit(40),
        ActivityLog.find({ workspace: workspace._id }).sort({ createdAt: -1 }).limit(25),
        Message.find({ workspace: workspace._id }).sort({ createdAt: -1 }).limit(12).populate('sender', 'name email avatar')
      ])
    : [[], [], []];

  res.json({
    result: await runSlashCommand({
      command: req.body.command,
      context: {
        text: req.body.text,
        latestMessages: messages.map((message) => message.content).join('\n'),
        tasks,
        activities,
        messages: messages.reverse()
      }
    })
  });
});
