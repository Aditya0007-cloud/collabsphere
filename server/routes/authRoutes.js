import express from 'express';
import { login, logout, logoutAll, me, refreshSession, signup } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.post('/signup', requireFields('name', 'email', 'password'), signup);
router.post('/login', requireFields('email', 'password'), login);
router.post('/refresh', refreshSession);
router.get('/me', protect, me);
router.post('/logout', protect, logout);
router.post('/logout-all', protect, logoutAll);

export default router;
