import express from 'express';
import multer from 'multer';
import {
  authenticateUser,
  requireRole,
  requireActiveAccount,
  requirePasswordChangeComplete,
  requireAssignedBatch,
} from '../middleware/authMiddleware.js';
import {
  getTeacherProfile,
  getAssignedBatches,
  getBatchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentStatus,
  getExcelTemplate,
  bulkImportStudents,
  getBatchLectures,
  createLecture,
  updateLecture,
  deleteLecture,
} from '../controllers/teacherController.js';

const router = express.Router();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.endsWith('.xlsx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel (.xlsx) files are supported.'));
    }
  },
});

// All teacher routes require authentication, teacher or superadmin role, active status, and password change
router.use(authenticateUser);
router.use(requireRole(['teacher', 'superadmin']));
router.use(requireActiveAccount);
router.use(requirePasswordChangeComplete);

// Teacher profile & batch listing
router.get('/profile', getTeacherProfile);
router.get('/batches', getAssignedBatches);

// Template download
router.get('/batches/:batchCode/students/template', requireAssignedBatch, getExcelTemplate);

// Batch student management (scoped to assigned batch)
router.get('/batches/:batchCode/students', requireAssignedBatch, getBatchStudents);
router.post('/batches/:batchCode/students', requireAssignedBatch, createStudent);
router.put('/batches/:batchCode/students/:id', requireAssignedBatch, updateStudent);
router.delete('/batches/:batchCode/students/:id', requireAssignedBatch, deleteStudent);
router.patch('/batches/:batchCode/students/:id/status', requireAssignedBatch, toggleStudentStatus);
router.post(
  '/batches/:batchCode/students/import',
  requireAssignedBatch,
  upload.single('file'),
  bulkImportStudents
);

// Batch lecture management (scoped to assigned batch)
router.get('/batches/:batchCode/lectures', requireAssignedBatch, getBatchLectures);
router.post('/batches/:batchCode/lectures', requireAssignedBatch, createLecture);
router.put('/batches/:batchCode/lectures/:lectureId', requireAssignedBatch, updateLecture);
router.delete('/batches/:batchCode/lectures/:lectureId', requireAssignedBatch, deleteLecture);

export default router;
