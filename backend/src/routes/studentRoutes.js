import express from 'express';
import { getProfile } from '../controllers/studentController.js';
import {
  authenticateStudent,
  requireActiveStudent,
  requirePasswordChangeComplete,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// All student routes require authentication, active status, and completed password change
router.use(authenticateStudent);
router.use(requireActiveStudent);
router.use(requirePasswordChangeComplete);

router.get('/profile', getProfile);

export default router;
