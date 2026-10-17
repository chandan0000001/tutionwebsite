import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  changePassword,
  getMe,
  logout,
} from '../controllers/authController.js';
import {
  authenticateUser,
  requireActiveAccount,
} from '../middleware/authMiddleware.js';
import {
  validateLogin,
  validateChangePassword,
} from '../middleware/validateRequest.js';

const router = express.Router();

// Rate limiter for student login: 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password change: 5 attempts per 15 minutes
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many password change attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validateLogin, login);
router.post(
  '/change-password',
  passwordChangeLimiter,
  authenticateUser,
  requireActiveAccount,
  validateChangePassword,
  changePassword
);
router.get('/me', authenticateUser, requireActiveAccount, getMe);
router.post('/logout', logout);

export default router;
