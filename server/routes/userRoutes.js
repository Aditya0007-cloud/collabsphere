import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.patch('/me', updateProfile);
router.get('/:id', getProfile);

export default router;
