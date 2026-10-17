import express from 'express';
import multer from 'multer';
import {
  authenticateUser,
  requireRole,
  requireActiveAccount,
  requirePasswordChangeComplete,
} from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getBatches,
  createBatch,
  updateBatch,
  getTeachers,
  createTeacher,
  updateTeacher,
  toggleTeacherStatus,
  resetTeacherPassword,
  getAllStudents,
  createStudent,
  updateStudent,
  toggleStudentStatus,
  bulkImportStudents,
  getAllLectures,
  createLecture,
  updateLecture,
  deleteLecture,
  getAuditLogs,
} from '../controllers/superadminController.js';
import { generateStudentTemplate } from '../services/excelService.js';

const router = express.Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for admin
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

// All superadmin routes require authentication, superadmin role, active account, and password change
router.use(authenticateUser);
router.use(requireRole('superadmin'));
router.use(requireActiveAccount);
router.use(requirePasswordChangeComplete);

// Dashboard overview stats
router.get('/dashboard', getDashboardStats);

// Batch management
router.get('/batches', getBatches);
router.post('/batches', createBatch);
router.put('/batches/:id', updateBatch);

// Teacher management
router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.patch('/teachers/:id/status', toggleTeacherStatus);
router.post('/teachers/:id/reset-password', resetTeacherPassword);

// Student management
router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.patch('/students/:id/status', toggleStudentStatus);
router.get('/students/template', async (req, res, next) => {
  try {
    const buffer = await generateStudentTemplate();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Antariksh_Students_Import_Template.xlsx"'
    );
    return res.send(buffer);
  } catch (err) {
    next(err);
  }
});
router.post('/students/import', upload.single('file'), bulkImportStudents);

// Lecture management across all batches
router.get('/lectures', getAllLectures);
router.post('/lectures', createLecture);
router.put('/lectures/:id', updateLecture);
router.delete('/lectures/:id', deleteLecture);

// Audit logs
router.get('/audit-logs', getAuditLogs);

export default router;
