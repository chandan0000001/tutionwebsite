import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Staff } from '../models/Staff.js';
import { Student } from '../models/Student.js';
import { Batch } from '../models/Batch.js';
import { Lecture } from '../models/Lecture.js';
import { AuditLog } from '../models/AuditLog.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { parseStudentExcel, generateStudentTemplate } from '../services/excelService.js';
import { ENV } from '../config/env.js';
import { normalizeIndianPhone } from '../utils/phone.js';
import { formatStudentUsername } from '../utils/usernameGenerator.js';
import { createSafeSearchRegex } from '../utils/sanitizeSearch.js';
import { validateYouTubeUrl } from '../utils/youtube.js';
import { revokeAllUserSessions } from '../utils/sessionManager.js';

// Helper: Generate teacher username
function generateTeacherUsername(name, sequence = 0) {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  const suffix = sequence > 0 ? `${sequence}` : '';
  return `aa_teacher_${cleanName}${suffix}`;
}

// Helper: Generate student username (e.g. "Swati Biswal" -> "swati.biswal")
function generateStudentUsername(name, batch, sequence = 0) {
  return formatStudentUsername(name, sequence);
}

// Helper: Generate 8-digit numeric temporary password
function generateNumericTempPassword() {
  const num = crypto.randomInt(10000000, 99999999);
  return `${num}`;
}

/**
 * GET /api/superadmin/dashboard
 * Aggregated institute overview statistics and recent administrative activity
 */
export async function getDashboardStats(req, res, next) {
  try {
    // Prevent intermediate or browser caches from returning stale dashboard metrics
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const [
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalTeachers,
      activeTeachers,
      totalBatches,
      activeBatches,
      totalLectures,
      publishedLectures,
      recentAuditLogs,
      recentStudents,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ isActive: true }),
      Student.countDocuments({ isActive: false }),
      Staff.countDocuments({ role: 'teacher' }),
      Staff.countDocuments({ role: 'teacher', isActive: true }),
      Batch.countDocuments(),
      Batch.countDocuments({ isActive: true }),
      Lecture.countDocuments(),
      Lecture.countDocuments({ isPublished: true }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10).lean(),
      Student.find().sort({ createdAt: -1 }).limit(5).select('-passwordHash').lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        counts: {
          students: { total: totalStudents, active: activeStudents, inactive: inactiveStudents },
          teachers: { total: totalTeachers, active: activeTeachers },
          batches: { total: totalBatches, active: activeBatches },
          lectures: { total: totalLectures, published: publishedLectures },
        },
        recentActivity: recentAuditLogs,
        recentStudents,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ========================================================================== */
/* BATCH MANAGEMENT                                                           */
/* ========================================================================== */

export async function getBatches(req, res, next) {
  try {
    const batches = await Batch.find().sort({ academicYear: -1, code: 1 }).lean();

    const batchesWithCounts = await Promise.all(
      batches.map(async (batch) => {
        const studentCount = await Student.countDocuments({
          $or: [
            { batchIds: batch._id },
            { batchCodes: batch.code },
            { batchCode: batch.code },
            { batch: batch.academicYear },
          ],
        });
        const lectureCount = await Lecture.countDocuments({
          $or: [{ batchCode: batch.code }, { batch: batch.academicYear }],
        });
        const assignedTeachers = await Staff.find({
          role: 'teacher',
          assignedBatches: batch.code,
        })
          .select('name username')
          .lean();

        return {
          ...batch,
          studentCount,
          lectureCount,
          assignedTeachers,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: batchesWithCounts,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBatch(req, res, next) {
  try {
    const { name, code, academicYear, description } = req.body;

    if (!name || !code || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Batch name, unique batch code (e.g. BATCH-2026), and academic year are required.',
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Batch.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A batch with code '${cleanCode}' already exists.`,
      });
    }

    const batch = await Batch.create({
      name: name.trim(),
      code: cleanCode,
      academicYear: academicYear.trim(),
      description: description ? description.trim() : '',
      isActive: true,
    });

    await recordAuditLog({
      req,
      action: 'BATCH_CREATE',
      targetType: 'Batch',
      targetId: batch._id,
      details: { name: batch.name, code: batch.code, academicYear: batch.academicYear },
    });

    return res.status(201).json({
      success: true,
      message: 'Batch created successfully.',
      data: batch,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBatch(req, res, next) {
  try {
    const { id } = req.params;
    const { name, academicYear, description, isActive } = req.body;

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found.',
      });
    }

    if (name) batch.name = name.trim();
    if (academicYear) batch.academicYear = academicYear.trim();
    if (description !== undefined) batch.description = String(description).trim();
    if (isActive !== undefined) batch.isActive = Boolean(isActive);

    await batch.save();

    await recordAuditLog({
      req,
      action: 'BATCH_UPDATE',
      targetType: 'Batch',
      targetId: batch._id,
      details: { name: batch.name, code: batch.code, isActive: batch.isActive },
    });

    return res.status(200).json({
      success: true,
      message: 'Batch updated successfully.',
      data: batch,
    });
  } catch (error) {
    next(error);
  }
}

/* ========================================================================== */
/* TEACHER MANAGEMENT                                                         */
/* ========================================================================== */

export async function getTeachers(req, res, next) {
  try {
    const teachers = await Staff.find({ role: 'teacher' })
      .sort({ createdAt: -1 })
      .select('-passwordHash')
      .lean();

    return res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTeacher(req, res, next) {
  try {
    const { name, qualification, dateOfBirth, phone, email, assignedBatches } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Teacher name and phone number are required.',
      });
    }

    const cleanPhone = normalizeIndianPhone(phone);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile phone number.',
      });
    }

    // Check duplicate phone or email
    const existing = await Staff.findOne({
      $or: [{ phone: cleanPhone }, ...(email ? [{ email: email.trim().toLowerCase() }] : [])],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A staff member with phone '${cleanPhone}' or email is already registered.`,
      });
    }

    // Generate unique username
    let seq = 0;
    let username = generateTeacherUsername(name, seq);
    while (await Staff.findOne({ username })) {
      seq++;
      username = generateTeacherUsername(name, seq);
    }

    // Generate 8-digit temporary password (valid for 1 hour)
    const temporaryPassword = generateNumericTempPassword();
    const temporaryPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const passwordHash = await bcrypt.hash(temporaryPassword, ENV.BCRYPT_SALT_ROUNDS);

    const safeBatches = Array.isArray(assignedBatches)
      ? assignedBatches.map((b) => String(b).trim().toUpperCase())
      : [];

    const teacher = await Staff.create({
      name: name.trim(),
      qualification: qualification ? qualification.trim() : '',
      dateOfBirth: dateOfBirth ? String(dateOfBirth).trim() : '',
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : '',
      username,
      passwordHash,
      role: 'teacher',
      assignedBatches: safeBatches,
      isActive: true,
      mustChangePassword: true,
      temporaryPasswordExpiresAt,
    });

    await recordAuditLog({
      req,
      action: 'TEACHER_CREATE',
      targetType: 'Teacher',
      targetId: teacher._id,
      details: { name: teacher.name, username: teacher.username, assignedBatches: safeBatches },
    });

    return res.status(201).json({
      success: true,
      message: 'Teacher profile created successfully.',
      teacher: teacher.toSafeObject(),
      oneTimeCredentials: {
        username: teacher.username,
        temporaryPassword,
        expiresAt: temporaryPasswordExpiresAt,
        note: 'Provide these initial temporary credentials to the teacher. This temporary password is valid for 1 hour only.',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacher(req, res, next) {
  try {
    const { id } = req.params;
    const { name, qualification, dateOfBirth, phone, email, assignedBatches } = req.body;

    const teacher = await Staff.findOne({ _id: id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    if (name) teacher.name = name.trim();
    if (qualification !== undefined) teacher.qualification = String(qualification).trim();
    if (dateOfBirth !== undefined) teacher.dateOfBirth = String(dateOfBirth).trim();
    if (email !== undefined) teacher.email = email ? email.trim().toLowerCase() : '';

    if (phone) {
      const cleanPhone = normalizeIndianPhone(phone);
      if (cleanPhone.length === 10 && cleanPhone !== teacher.phone) {
        const dup = await Staff.findOne({ phone: cleanPhone, _id: { $ne: teacher._id } });
        if (dup) {
          return res.status(400).json({
            success: false,
            message: `Phone number '${cleanPhone}' is registered to another staff member.`,
          });
        }
        teacher.phone = cleanPhone;
      }
    }

    if (Array.isArray(assignedBatches)) {
      teacher.assignedBatches = assignedBatches.map((b) => String(b).trim().toUpperCase());
    }

    await teacher.save();

    await recordAuditLog({
      req,
      action: 'TEACHER_UPDATE',
      targetType: 'Teacher',
      targetId: teacher._id,
      details: { name: teacher.name, username: teacher.username, assignedBatches: teacher.assignedBatches },
    });

    return res.status(200).json({
      success: true,
      message: 'Teacher profile updated successfully.',
      teacher: teacher.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleTeacherStatus(req, res, next) {
  try {
    const { id } = req.params;
    const teacher = await Staff.findOne({ _id: id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    teacher.isActive = !teacher.isActive;
    await teacher.save();

    if (!teacher.isActive) {
      await revokeAllUserSessions(teacher._id, 'account_deactivated');
    }

    await recordAuditLog({
      req,
      action: teacher.isActive ? 'TEACHER_REACTIVATE' : 'TEACHER_DEACTIVATE',
      targetType: 'Teacher',
      targetId: teacher._id,
      details: { name: teacher.name, username: teacher.username, isActive: teacher.isActive },
    });

    return res.status(200).json({
      success: true,
      message: `Teacher account ${teacher.isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: teacher.isActive,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetTeacherPassword(req, res, next) {
  try {
    const { id } = req.params;
    const teacher = await Staff.findOne({ _id: id, role: 'teacher' });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    const temporaryPassword = generateNumericTempPassword();
    const temporaryPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    teacher.passwordHash = await bcrypt.hash(temporaryPassword, ENV.BCRYPT_SALT_ROUNDS);
    teacher.mustChangePassword = true;
    teacher.temporaryPasswordExpiresAt = temporaryPasswordExpiresAt;
    teacher.passwordChangedAt = new Date();
    teacher.tokenVersion = (teacher.tokenVersion || 1) + 1;
    await teacher.save();

    await revokeAllUserSessions(teacher._id, 'password_reset_by_superadmin');

    await recordAuditLog({
      req,
      action: 'PASSWORD_RESET',
      targetType: 'Teacher',
      targetId: teacher._id,
      details: { username: teacher.username },
    });

    return res.status(200).json({
      success: true,
      message: 'Teacher password reset successfully.',
      oneTimeCredentials: {
        username: teacher.username,
        temporaryPassword,
        expiresAt: temporaryPasswordExpiresAt,
        note: 'Provide this temporary password to the teacher. This temporary password is valid for 1 hour only.',
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ========================================================================== */
/* STUDENT MANAGEMENT ACROSS ALL BATCHES                                      */
/* ========================================================================== */

export async function getAllStudents(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const search = (req.query.search || '').trim();
    const batchCode = (req.query.batchCode || '').trim().toUpperCase();

    const filter = {};

    if (batchCode) {
      const academicYear = batchCode.replace('BATCH-', '');
      const batchDoc = await Batch.findOne({
        $or: [{ code: batchCode }, { academicYear }],
      });
      const batchCondition = [
        { batchCodes: batchCode },
        { batchCode },
        { batch: academicYear },
      ];
      if (batchDoc) {
        batchCondition.push({ batchIds: batchDoc._id });
      }
      filter.$or = batchCondition;
    }

    if (search) {
      const searchRegex = createSafeSearchRegex(search);
      if (searchRegex) {
        filter.$and = [
          {
            $or: [{ name: searchRegex }, { phone: searchRegex }, { username: searchRegex }],
          },
        ];
      }
    }

    const totalRecords = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-passwordHash')
      .lean();

    return res.status(200).json({
      success: true,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      data: students,
    });
  } catch (error) {
    next(error);
  }
}

export async function createStudent(req, res, next) {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      email,
      address,
      college,
      fatherName,
      motherName,
      batchCode,
    } = req.body;

    if (!name || !phone || !batchCode) {
      return res.status(400).json({
        success: false,
        message: 'Name, 10-digit phone number, and batch selection are required.',
      });
    }

    const cleanBatch = batchCode.trim().toUpperCase();
    const academicYear = cleanBatch.replace('BATCH-', '');
    const cleanPhone = normalizeIndianPhone(phone);

    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be a valid 10-digit mobile number.',
      });
    }

    const existing = await Student.findOne({ phone: cleanPhone });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A student with phone '${cleanPhone}' is already enrolled.`,
      });
    }

    let seq = 0;
    let username = generateStudentUsername(name, academicYear, seq);
    while (await Student.findOne({ username })) {
      seq++;
      username = generateStudentUsername(name, academicYear, seq);
    }

    // Dynamic initial password is the student's 10-digit phone number
    const initialPassword = cleanPhone;
    const passwordHash = await bcrypt.hash(initialPassword, ENV.BCRYPT_SALT_ROUNDS);

    const batchDoc = await Batch.findOne({
      $or: [{ code: cleanBatch }, { academicYear }],
    });

    const newStudent = await Student.create({
      name: name.trim(),
      phone: cleanPhone,
      dateOfBirth: dateOfBirth ? String(dateOfBirth).trim() : 'N/A',
      email: email ? email.trim().toLowerCase() : `${username}@student.antariksh.edu.in`,
      address: typeof address === 'string' ? { street: address } : address || { street: 'N/A' },
      college: college ? college.trim() : 'N/A',
      fatherName: fatherName ? fatherName.trim() : 'N/A',
      motherName: motherName ? motherName.trim() : 'N/A',
      batch: academicYear,
      batchCode: cleanBatch,
      batchCodes: [cleanBatch],
      batchIds: batchDoc ? [batchDoc._id] : [],
      username,
      passwordHash,
      isActive: true,
      mustChangePassword: false,
      temporaryPasswordExpiresAt: null,
    });

    await recordAuditLog({
      req,
      action: 'STUDENT_CREATE',
      targetType: 'Student',
      targetId: newStudent._id,
      details: { name: newStudent.name, username: newStudent.username, batchCode: cleanBatch },
    });

    return res.status(201).json({
      success: true,
      message: 'Student created successfully.',
      student: newStudent.toSafeObject(),
      oneTimeCredentials: {
        username: newStudent.username,
        temporaryPassword: initialPassword,
        expiresAt: null,
        note: `Initial login password is the student's mobile number (${cleanPhone}). The student can sign in immediately and change their password at any time.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    const {
      name,
      phone,
      dateOfBirth,
      email,
      address,
      college,
      fatherName,
      motherName,
      batchCode,
    } = req.body;

    if (name) student.name = name.trim();
    if (dateOfBirth) student.dateOfBirth = String(dateOfBirth).trim();
    if (email !== undefined) student.email = email ? email.trim().toLowerCase() : '';
    if (address !== undefined) {
      student.address = typeof address === 'string' ? { street: address } : address;
    }
    if (college !== undefined) student.college = String(college || '').trim();
    if (fatherName !== undefined) student.fatherName = String(fatherName || '').trim();
    if (motherName !== undefined) student.motherName = String(motherName || '').trim();

    if (batchCode) {
      const cleanBatch = batchCode.trim().toUpperCase();
      const academicYear = cleanBatch.replace('BATCH-', '');
      student.batchCode = cleanBatch;
      student.batch = academicYear;
      if (!Array.isArray(student.batchCodes)) student.batchCodes = [];
      if (!student.batchCodes.includes(cleanBatch)) {
        student.batchCodes.push(cleanBatch);
      }
      const batchDoc = await Batch.findOne({
        $or: [{ code: cleanBatch }, { academicYear }],
      });
      if (batchDoc) {
        if (!Array.isArray(student.batchIds)) student.batchIds = [];
        if (!student.batchIds.some((bId) => bId.toString() === batchDoc._id.toString())) {
          student.batchIds.push(batchDoc._id);
        }
      }
    }

    if (phone) {
      const cleanPhone = normalizeIndianPhone(phone);
      if (cleanPhone.length === 10 && cleanPhone !== student.phone) {
        const dup = await Student.findOne({ phone: cleanPhone, _id: { $ne: student._id } });
        if (dup) {
          return res.status(400).json({
            success: false,
            message: `Phone number '${cleanPhone}' is registered to another student.`,
          });
        }
        student.phone = cleanPhone;
      }
    }

    await student.save();

    await recordAuditLog({
      req,
      action: 'STUDENT_UPDATE',
      targetType: 'Student',
      targetId: student._id,
      details: { name: student.name, username: student.username, batchCode: student.batchCode },
    });

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      student: student.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleStudentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    student.isActive = !student.isActive;
    await student.save();

    if (!student.isActive) {
      await revokeAllUserSessions(student._id, 'account_deactivated');
    }

    await recordAuditLog({
      req,
      action: student.isActive ? 'STUDENT_REACTIVATE' : 'STUDENT_DEACTIVATE',
      targetType: 'Student',
      targetId: student._id,
      details: { name: student.name, username: student.username, isActive: student.isActive },
    });

    return res.status(200).json({
      success: true,
      message: `Student account has been ${student.isActive ? 'reactivated' : 'deactivated'}.`,
      isActive: student.isActive,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetStudentPassword(req, res, next) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    const temporaryPassword = generateNumericTempPassword();
    const temporaryPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    student.passwordHash = await bcrypt.hash(temporaryPassword, ENV.BCRYPT_SALT_ROUNDS);
    student.mustChangePassword = true;
    student.temporaryPasswordExpiresAt = temporaryPasswordExpiresAt;
    student.passwordChangedAt = new Date();
    student.tokenVersion = (student.tokenVersion || 1) + 1;
    await student.save();

    await revokeAllUserSessions(student._id, 'password_reset_by_superadmin');

    await recordAuditLog({
      req,
      action: 'PASSWORD_RESET',
      targetType: 'Student',
      targetId: student._id,
      details: { username: student.username },
    });

    return res.status(200).json({
      success: true,
      message: 'Student password reset successfully.',
      oneTimeCredentials: {
        username: student.username,
        temporaryPassword,
        expiresAt: temporaryPasswordExpiresAt,
        note: 'Provide this temporary password to the student. This temporary password is valid for 1 hour only.',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function bulkImportStudents(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an Excel (.xlsx) file.',
      });
    }

    const { batchCode } = req.body;
    if (!batchCode) {
      return res.status(400).json({
        success: false,
        message: 'Please select a target batch for this bulk import.',
      });
    }

    const cleanBatch = batchCode ? batchCode.trim().toUpperCase() : 'BATCH-CHSE';

    const parseResult = await parseStudentExcel(req.file.buffer);

    let importedCount = 0;
    let skippedCount = 0;
    const createdAccounts = [];

    for (const validItem of parseResult.validRows) {
      const record = validItem.data;

      // Determine target batch: row-level batch column takes precedence if present, else default to selected batch
      let targetBatch = cleanBatch;
      if (record.batchCode) {
        const raw = record.batchCode.trim().toUpperCase();
        if (raw.includes('CHSE')) targetBatch = 'BATCH-CHSE';
        else if (raw.includes('JEE')) targetBatch = 'BATCH-JEE';
        else if (raw.includes('NEET')) targetBatch = 'BATCH-NEET';
        else if (raw.includes('INTG') || raw.includes('INTEGRATED')) targetBatch = 'BATCH-INTG';
        else if (raw.includes('OUAT') || raw.includes('ICAR')) targetBatch = 'BATCH-OUAT-ICAR';
        else if (raw.startsWith('BATCH-')) targetBatch = raw;
      }
      const academicYear = targetBatch.replace('BATCH-', '');

      const existing = await Student.findOne({
        $or: [{ phone: record.phone }, ...(record.email && record.email !== 'N/A' ? [{ email: record.email }] : [])],
      });

      if (existing) {
        skippedCount++;
        parseResult.duplicateRows.push({
          rowNumber: validItem.rowNumber,
          data: record,
          reason: `Already exists in academy database with phone '${record.phone}'`,
        });
        continue;
      }

      let seq = 0;
      let username = generateStudentUsername(record.name, academicYear, seq);
      while (await Student.findOne({ username })) {
        seq++;
        username = generateStudentUsername(record.name, academicYear, seq);
      }

      // Initial password is the student's 10-digit mobile number
      const initialPassword = record.phone;
      const passwordHash = await bcrypt.hash(initialPassword, ENV.BCRYPT_SALT_ROUNDS);

      const batchDoc = await Batch.findOne({
        $or: [{ code: targetBatch }, { academicYear }],
      });

      const newStudent = await Student.create({
        name: record.name,
        phone: record.phone,
        dateOfBirth: record.dateOfBirth || 'N/A',
        email: record.email && record.email !== 'N/A' ? record.email : `${username}@student.antariksh.edu.in`,
        address: typeof record.address === 'string' ? { street: record.address } : record.address || { street: 'N/A' },
        college: record.college || 'N/A',
        fatherName: record.fatherName || 'N/A',
        motherName: record.motherName || 'N/A',
        batch: academicYear,
        batchCode: targetBatch,
        batchCodes: [targetBatch],
        batchIds: batchDoc ? [batchDoc._id] : [],
        username,
        passwordHash,
        isActive: true,
        mustChangePassword: false,
        temporaryPasswordExpiresAt: null,
      });

      importedCount++;
      createdAccounts.push({
        name: record.name,
        username: newStudent.username,
        phone: record.phone,
        temporaryPassword: initialPassword,
        expiresAt: null,
      });
    }

    await recordAuditLog({
      req,
      action: 'EXCEL_IMPORT',
      targetType: 'BulkImport',
      targetId: cleanBatch,
      details: {
        batchCode: cleanBatch,
        totalRows: parseResult.totalRows,
        importedCount,
        skippedCount,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Bulk import completed: ${importedCount} created, ${skippedCount} skipped, ${parseResult.invalidRows.length} invalid.`,
      summary: {
        totalRows: parseResult.totalRows,
        importedCount,
        skippedCount,
        invalidCount: parseResult.invalidRows.length,
        duplicateCount: parseResult.duplicateRows.length,
      },
      invalidRows: parseResult.invalidRows,
      duplicateRows: parseResult.duplicateRows,
      createdAccounts,
    });
  } catch (error) {
    next(error);
  }
}

/* ========================================================================== */
/* LECTURE MANAGEMENT ACROSS ALL BATCHES                                      */
/* ========================================================================== */

export async function getAllLectures(req, res, next) {
  try {
    const batchCode = (req.query.batchCode || '').trim().toUpperCase();
    const filter = {};

    if (batchCode) {
      filter.$or = [{ batchCode }, { batch: batchCode.replace('BATCH-', '') }];
    }

    const lectures = await Lecture.find(filter).sort({ batch: -1, slNo: 1 }).lean();

    return res.status(200).json({
      success: true,
      data: lectures,
    });
  } catch (error) {
    next(error);
  }
}

export async function createLecture(req, res, next) {
  try {
    const { slNo, topicName, ytVideoLink, subject, description, isPublished, batchCode } = req.body;

    if (!slNo || !topicName || !ytVideoLink || !subject || !batchCode) {
      return res.status(400).json({
        success: false,
        message: 'Serial number, topic name, subject, YouTube link, and batch selection are required.',
      });
    }

    const ytValidation = validateYouTubeUrl(ytVideoLink);
    if (!ytValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: ytValidation.error || 'Invalid YouTube video URL.',
      });
    }

    const cleanBatch = batchCode.trim().toUpperCase();
    const academicYear = cleanBatch.replace('BATCH-', '');

    const conflict = await Lecture.findOne({
      $or: [{ batchCode: cleanBatch }, { batch: academicYear }],
      slNo: Number(slNo),
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `A lecture with serial number #${slNo} already exists in batch ${cleanBatch}.`,
      });
    }

    const lecture = await Lecture.create({
      slNo: Number(slNo),
      topicName: topicName.trim(),
      ytVideoLink: ytValidation.canonicalUrl,
      subject: subject.trim(),
      description: description ? description.trim() : '',
      batch: academicYear,
      batchCode: cleanBatch,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      createdBy: req.user.username,
      lastUpdatedBy: req.user.username,
    });

    await recordAuditLog({
      req,
      action: 'LECTURE_CREATE',
      targetType: 'Lecture',
      targetId: lecture._id,
      details: { topicName: lecture.topicName, slNo: lecture.slNo, batchCode: cleanBatch },
    });

    return res.status(201).json({
      success: true,
      message: 'Lecture created successfully.',
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLecture(req, res, next) {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found.',
      });
    }

    const { slNo, topicName, ytVideoLink, subject, description, isPublished, batchCode } = req.body;

    if (batchCode) {
      lecture.batchCode = batchCode.trim().toUpperCase();
      lecture.batch = lecture.batchCode.replace('BATCH-', '');
    }

    if (slNo !== undefined) {
      const numSlNo = Number(slNo);
      if (numSlNo !== lecture.slNo) {
        const conflict = await Lecture.findOne({
          _id: { $ne: lecture._id },
          $or: [{ batchCode: lecture.batchCode }, { batch: lecture.batch }],
          slNo: numSlNo,
        });
        if (conflict) {
          return res.status(400).json({
            success: false,
            message: `Serial number #${numSlNo} already in use for this batch.`,
          });
        }
        lecture.slNo = numSlNo;
      }
    }

    if (topicName) lecture.topicName = topicName.trim();
    if (ytVideoLink) {
      const ytValidation = validateYouTubeUrl(ytVideoLink);
      if (!ytValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: ytValidation.error || 'Invalid YouTube video URL.',
        });
      }
      lecture.ytVideoLink = ytValidation.canonicalUrl;
    }
    if (subject) lecture.subject = subject.trim();
    if (description !== undefined) lecture.description = String(description).trim();
    if (isPublished !== undefined) lecture.isPublished = Boolean(isPublished);
    lecture.lastUpdatedBy = req.user.username;

    await lecture.save();

    await recordAuditLog({
      req,
      action: 'LECTURE_UPDATE',
      targetType: 'Lecture',
      targetId: lecture._id,
      details: {
        topicName: lecture.topicName,
        slNo: lecture.slNo,
        isPublished: lecture.isPublished,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Lecture updated successfully.',
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLecture(req, res, next) {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findByIdAndDelete(id);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found.',
      });
    }

    await recordAuditLog({
      req,
      action: 'LECTURE_DELETE',
      targetType: 'Lecture',
      targetId: id,
      details: { topicName: lecture.topicName, slNo: lecture.slNo },
    });

    return res.status(200).json({
      success: true,
      message: 'Lecture removed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/* ========================================================================== */
/* AUDIT LOGS                                                                 */
/* ========================================================================== */

export async function getAuditLogs(req, res, next) {
  try {
    // Prevent browser and proxy caching so administrative audit records update in real time
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
    const action = (req.query.action || '').trim().toUpperCase();
    const actor = (req.query.actor || '').trim();

    const filter = {};
    if (action) filter.action = action;
    if (actor) {
      const actorRegex = createSafeSearchRegex(actor);
      if (actorRegex) filter.actorUsername = actorRegex;
    }

    const totalRecords = await AuditLog.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/superadmin/students/:id
 * Permanently delete a student record directly from the database
 */
export async function deleteStudent(req, res, next) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    await Student.findByIdAndDelete(id);

    await recordAuditLog({
      req,
      action: 'STUDENT_DELETE',
      targetType: 'Student',
      targetId: id,
      details: { name: student.name, username: student.username, batchCode: student.batchCode },
    });

    return res.status(200).json({
      success: true,
      message: `Student '${student.name}' (@${student.username}) has been permanently deleted from the database.`,
    });
  } catch (error) {
    next(error);
  }
}

