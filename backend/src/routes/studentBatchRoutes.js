import express from 'express';
import {
  authenticateUser,
  requireRole,
  requireActiveAccount,
  requirePasswordChangeComplete,
} from '../middleware/authMiddleware.js';
import {
  getStudentBatches,
  assignBatchToStudent,
  removeBatchFromStudent,
} from '../controllers/studentBatchController.js';

const router = express.Router();

// All batch enrollment endpoints require authentication, active account, and completed initial password change
router.use(authenticateUser);
router.use(requireActiveAccount);
router.use(requirePasswordChangeComplete);

// GET /api/students/:studentId/batches
// Students can view their own batches; Teachers and Superadmins can inspect student assignments
router.get('/:studentId/batches', getStudentBatches);

// POST /api/students/:studentId/batches
// Enroll student into an additional batch (Teachers restricted to their authorized batches, Superadmin across all)
router.post(
  '/:studentId/batches',
  requireRole(['superadmin', 'teacher']),
  assignBatchToStudent
);

// DELETE /api/students/:studentId/batches/:batchId
// Remove a batch assignment from student
router.delete(
  '/:studentId/batches/:batchId',
  requireRole(['superadmin', 'teacher']),
  removeBatchFromStudent
);

export default router;
