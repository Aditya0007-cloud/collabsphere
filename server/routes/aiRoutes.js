import express from 'express';
import { insights, smartTasks, summarize } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/summarize', summarize);
router.post('/smart-tasks', smartTasks);
router.get('/:workspaceId/insights', insights);

export default router;
