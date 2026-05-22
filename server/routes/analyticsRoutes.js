import express from 'express';
import { getDashboard } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/:workspaceId/dashboard', getDashboard);

export default router;
