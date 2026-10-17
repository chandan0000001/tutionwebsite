import express from 'express';
import {
  getLectures,
  getLectureById,
  getBatchSubjects,
} from '../controllers/lectureController.js';
import {
  authenticateStudent,
  requireActiveStudent,
  requirePasswordChangeComplete,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected lecture routes: Only active students who have completed initial password change
router.use(authenticateStudent);
router.use(requireActiveStudent);
router.use(requirePasswordChangeComplete);

router.get('/', getLectures);
router.get('/subjects', getBatchSubjects);
router.get('/:id', getLectureById);

export default router;
