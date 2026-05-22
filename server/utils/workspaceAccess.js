import Workspace from '../models/Workspace.js';
import { ApiError } from './apiError.js';

export const getMemberWorkspace = async (workspaceId, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    'members.user': userId
  });

  if (!workspace) throw new ApiError(404, 'Workspace not found or access denied');
  return workspace;
};
