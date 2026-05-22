import express from 'express';
import { createWorkspace, getWorkspace, joinWorkspace, listWorkspaces, updateWorkspace } from '../controllers/workspaceController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.route('/').get(listWorkspaces).post(requireFields('name'), createWorkspace);
router.post('/join', requireFields('inviteCode'), joinWorkspace);
router.route('/:id').get(getWorkspace).patch(updateWorkspace);

export default router;
