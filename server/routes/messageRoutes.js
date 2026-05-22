import express from 'express';
import { createMessage, listMessages, pinMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.route('/:workspaceId').get(listMessages).post(requireFields('content'), createMessage);
router.patch('/:workspaceId/:messageId/pin', pinMessage);

export default router;
