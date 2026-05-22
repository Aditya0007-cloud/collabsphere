import express from 'express';
import { assistant, insights, meetingNotes, recommendations, slashCommand, smartReplies, smartTasks, summarize } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/summarize', summarize);
router.post('/smart-tasks', smartTasks);
router.post('/meeting-notes', meetingNotes);
router.post('/smart-replies', smartReplies);
router.post('/slash-command', slashCommand);
router.get('/:workspaceId/insights', insights);
router.get('/:workspaceId/recommendations', recommendations);
router.post('/:workspaceId/assistant', assistant);

export default router;
