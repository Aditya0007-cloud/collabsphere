import ActivityLog from '../models/ActivityLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';

export const listActivity = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const activities = await ActivityLog.find({ workspace: req.params.workspaceId })
    .populate('actor', 'name avatar')
    .sort('-createdAt')
    .limit(50);
  res.json({ activities });
});
