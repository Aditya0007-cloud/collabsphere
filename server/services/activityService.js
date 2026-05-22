import ActivityLog from '../models/ActivityLog.js';
import { emitToWorkspace } from '../utils/emitters.js';

export const createActivity = async ({ workspace, actor, type, title, metadata = {} }) => {
  const activity = await ActivityLog.create({ workspace, actor, type, title, metadata });
  const populated = await activity.populate('actor', 'name avatar');
  emitToWorkspace(workspace.toString(), 'activity:new', populated);
  return populated;
};
