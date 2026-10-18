import mongoose from 'mongoose';
import { Student } from '../models/Student.js';
import { Batch } from '../models/Batch.js';
import { recordAuditLog } from '../utils/auditLogger.js';

/**
 * Helper: Check if a teacher is authorized to manage a specific batch
 */
function isTeacherAuthorizedForBatch(teacher, batchCode) {
  if (!teacher || teacher.role !== 'teacher') return false;
  const clean = String(batchCode).trim().toUpperCase();
  const assigned = (teacher.assignedBatches || []).map((b) => b.toUpperCase());
  return (
    assigned.includes(clean) ||
    assigned.includes(`BATCH-${clean}`) ||
    assigned.map((b) => b.replace('BATCH-', '')).includes(clean.replace('BATCH-', ''))
  );
}

/**
 * GET /api/students/:studentId/batches
 * Retrieve all enrolled batches for a student.
 */
export async function getStudentBatches(req, res, next) {
  try {
    const rawStudentId = req.params.studentId;
    const studentId = (rawStudentId === 'me' && req.user) ? req.user._id.toString() : rawStudentId;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
    }

    const student = await Student.findById(studentId).populate('batchIds');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Role verification
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Access denied: You can only view your own batches.' });
    }

    return res.status(200).json({
      success: true,
      studentId: student._id,
      studentName: student.name,
      batches: student.batchIds || [],
      batchCodes: student.batchCodes || [],
      primaryBatch: student.batchCode || '',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/students/:studentId/batches
 * Atomically enroll a student in an additional batch without replacing existing ones.
 */
export async function assignBatchToStudent(req, res, next) {
  try {
    const rawStudentId = req.params.studentId;
    const studentId = (rawStudentId === 'me' && req.user) ? req.user._id.toString() : rawStudentId;
    const { batchId, batchCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
    }

    // Identify target batch
    let targetBatch = null;
    if (batchId && mongoose.Types.ObjectId.isValid(batchId)) {
      targetBatch = await Batch.findById(batchId);
    }
    if (!targetBatch && (batchCode || batchId)) {
      const searchCode = String(batchCode || batchId).trim().toUpperCase();
      targetBatch = await Batch.findOne({
        $or: [{ code: searchCode }, { academicYear: searchCode.replace('BATCH-', '') }],
      });
    }

    if (!targetBatch) {
      return res.status(404).json({ success: false, message: 'Target batch not found.' });
    }

    if (targetBatch.isActive === false) {
      return res.status(400).json({ success: false, message: 'Cannot assign student to an inactive batch.' });
    }

    // Authorization check
    if (req.user.role === 'teacher') {
      if (!isTeacherAuthorizedForBatch(req.user, targetBatch.code)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: You are not authorized to assign students to batch '${targetBatch.code}'. You may only assign students to your authorized batches (${(req.user.assignedBatches || []).join(', ')}).`,
        });
      }
    } else if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Access denied: Administrative privileges required.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Check if already assigned
    const alreadyAssigned =
      (student.batchCodes || []).includes(targetBatch.code) ||
      (student.batchIds || []).some((id) => id.toString() === targetBatch._id.toString());

    if (alreadyAssigned) {
      const populated = await Student.findById(studentId).populate('batchIds');
      return res.status(200).json({
        success: true,
        alreadyAssigned: true,
        message: `Student is already enrolled in batch ${targetBatch.name} (${targetBatch.code}).`,
        student: populated.toSafeObject(),
        batches: populated.batchIds,
      });
    }

    // Atomic update using $addToSet to prevent race conditions and duplicate entries
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $addToSet: {
          batchIds: targetBatch._id,
          batchCodes: targetBatch.code,
        },
      },
      { new: true }
    ).populate('batchIds');

    // Synchronize primary batch fields if not set
    if (!updatedStudent.batchCode) {
      updatedStudent.batchCode = targetBatch.code;
      updatedStudent.batch = targetBatch.academicYear || targetBatch.code.replace('BATCH-', '');
      await updatedStudent.save();
    }

    await recordAuditLog({
      req,
      action: 'STUDENT_BATCH_ASSIGN',
      targetType: 'Student',
      targetId: student._id,
      details: {
        studentName: student.name,
        username: student.username,
        assignedBatch: targetBatch.code,
        allBatches: updatedStudent.batchCodes,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Student successfully enrolled into batch ${targetBatch.name} (${targetBatch.code}).`,
      student: updatedStudent.toSafeObject(),
      batches: updatedStudent.batchIds,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/students/:studentId/batches/:batchId
 * Remove an individual batch enrollment from a student without affecting other enrollments.
 */
export async function removeBatchFromStudent(req, res, next) {
  try {
    const rawStudentId = req.params.studentId;
    const studentId = (rawStudentId === 'me' && req.user) ? req.user._id.toString() : rawStudentId;
    const { batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
    }

    // Resolve target batch by ObjectId or code
    let targetBatch = null;
    if (mongoose.Types.ObjectId.isValid(batchId)) {
      targetBatch = await Batch.findById(batchId);
    } else {
      const cleanCode = String(batchId).trim().toUpperCase();
      targetBatch = await Batch.findOne({
        $or: [{ code: cleanCode }, { academicYear: cleanCode.replace('BATCH-', '') }],
      });
    }

    if (!targetBatch) {
      return res.status(404).json({ success: false, message: 'Batch not found.' });
    }

    // Authorization check
    if (req.user.role === 'teacher') {
      if (!isTeacherAuthorizedForBatch(req.user, targetBatch.code)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: You are not authorized to remove students from batch '${targetBatch.code}'.`,
        });
      }
    } else if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Access denied: Administrative privileges required.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Atomic removal using $pull
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $pull: {
          batchIds: targetBatch._id,
          batchCodes: targetBatch.code,
        },
      },
      { new: true }
    ).populate('batchIds');

    // Handle sensible state when final batch is removed or update primary batch
    if (updatedStudent.batchCodes.length === 0) {
      updatedStudent.batchCode = '';
      updatedStudent.batch = '';
      await updatedStudent.save();
    } else if (updatedStudent.batchCode === targetBatch.code) {
      updatedStudent.batchCode = updatedStudent.batchCodes[0];
      updatedStudent.batch = updatedStudent.batchCode.replace('BATCH-', '');
      await updatedStudent.save();
    }

    await recordAuditLog({
      req,
      action: 'STUDENT_BATCH_REMOVE',
      targetType: 'Student',
      targetId: student._id,
      details: {
        studentName: student.name,
        username: student.username,
        removedBatch: targetBatch.code,
        remainingBatches: updatedStudent.batchCodes,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Batch ${targetBatch.code} removed from student successfully.`,
      student: updatedStudent.toSafeObject(),
      batches: updatedStudent.batchIds,
    });
  } catch (error) {
    next(error);
  }
}
