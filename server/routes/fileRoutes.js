import express from 'express';
import { listFiles, uploadFile } from '../controllers/fileController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);
router.route('/:workspaceId').get(listFiles).post(upload.single('file'), uploadFile);

export default router;
