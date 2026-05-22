import express from 'express';
import { login, logout, me, signup } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.post('/signup', requireFields('name', 'email', 'password'), signup);
router.post('/login', requireFields('email', 'password'), login);
router.get('/me', protect, me);
router.post('/logout', protect, logout);

export default router;
