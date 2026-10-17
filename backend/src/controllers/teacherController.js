import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Student } from '../models/Student.js';
import { Batch } from '../models/Batch.js';
import { Lecture } from '../models/Lecture.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { parseStudentExcel, generateStudentTemplate } from '../services/excelService.js';
import { ENV } from '../config/env.js';
import { normalizeIndianPhone } from '../utils/phone.js';
import { formatStudentUsername } from '../utils/usernameGenerator.js';
import { createSafeSearchRegex } from '../utils/sanitizeSearch.js';
import { validateYouTubeUrl } from '../utils/youtube.js';
import { revokeAllUserSessions } from '../utils/sessionManager.js';

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
 * GET /api/teacher/profile
 */
export async function getTeacherProfile(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/teacher/batches
 * List batches assigned to the authenticated teacher with counts
 */
export async function getAssignedBatches(req, res, next) {
  try {
    const assignedCodes = (req.user.assignedBatches || []).map((b) => b.toUpperCase());

    const batches = await Batch.find({
      $or: [
        { code: { $in: assignedCodes } },
        { academicYear: { $in: assignedCodes.map((b) => b.replace('BATCH-', '')) } },
      ],
      isActive: true,
    }).lean();

    // Populate student and lecture counts for each batch
    const batchesWithCounts = await Promise.all(
      batches.map(async (batch) => {
        const studentCount = await Student.countDocuments({
          $or: [{ batchCode: batch.code }, { batch: batch.academicYear }],
          isActive: true,
        });

        const lectureCount = await Lecture.countDocuments({
          $or: [{ batchCode: batch.code }, { batch: batch.academicYear }],
        });

        return {
          ...batch,
          studentCount,
          lectureCount,
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

/**
 * GET /api/teacher/batches/:batchCode/students
 * List students for an assigned batch
 */
export async function getBatchStudents(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim();
    const batchCode = rawBatch.toUpperCase();
    const academicYear = batchCode.replace('BATCH-', '');

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const search = (req.query.search || '').trim();

    const filter = {
      $or: [{ batchCode }, { batch: academicYear }],
    };

    if (search) {
      const searchRegex = createSafeSearchRegex(search);
      if (searchRegex) {
        filter.$and = [
          {
            $or: [
              { name: searchRegex },
              { phone: searchRegex },
              { username: searchRegex },
            ],
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
      .lean();

    const sanitized = students.map((s) => {
      delete s.passwordHash;
      delete s.__v;
      return s;
    });

    return res.status(200).json({
      success: true,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/teacher/batches/:batchCode/students
 * Manually create a single student in an assigned batch
 */
export async function createStudent(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim();
    const batchCode = rawBatch.toUpperCase();
    const academicYear = batchCode.replace('BATCH-', '');

    const {
      name,
      phone,
      dateOfBirth,
      email,
      address,
      college,
      fatherName,
      motherName,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and 10-digit mobile phone are required.',
      });
    }

    const cleanPhone = normalizeIndianPhone(phone);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be a valid 10-digit mobile number.',
      });
    }

    // Check existing
    const existing = await Student.findOne({ phone: cleanPhone });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A student with phone number '${cleanPhone}' already exists in the institute records.`,
      });
    }

    // Generate unique username
    let seq = 0;
    let username = generateStudentUsername(name, academicYear, seq);
    while (await Student.findOne({ username })) {
      seq++;
      username = generateStudentUsername(name, academicYear, seq);
    }

    // Dynamic initial password is the student's 10-digit mobile phone number
    const initialPassword = cleanPhone;
    const passwordHash = await bcrypt.hash(initialPassword, ENV.BCRYPT_SALT_ROUNDS);

    const newStudent = await Student.create({
      name: name.trim(),
      phone: cleanPhone,
      dateOfBirth: dateOfBirth ? String(dateOfBirth).trim() : 'N/A',
      email: email ? String(email).trim().toLowerCase() : `${username}@student.antariksh.edu.in`,
      address: typeof address === 'string' ? { street: address } : address || { street: 'N/A' },
      college: college ? String(college).trim() : 'N/A',
      fatherName: fatherName ? String(fatherName).trim() : 'N/A',
      motherName: motherName ? String(motherName).trim() : 'N/A',
      batch: academicYear,
      batchCode,
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
      details: {
        name: newStudent.name,
        username: newStudent.username,
        batch: academicYear,
        batchCode,
      },
    });

    const safeStudent = newStudent.toSafeObject();

    return res.status(201).json({
      success: true,
      message: 'Student created successfully.',
      student: safeStudent,
      oneTimeCredentials: {
        username: newStudent.username,
        temporaryPassword: initialPassword,
        expiresAt: null,
        note: `Initial login password is the student's mobile number (${cleanPhone}). The student can sign in immediately and update their password at any time.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/teacher/batches/:batchCode/students/:id
 * Edit student information in an assigned batch
 */
export async function updateStudent(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in your assigned batch.',
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
    } = req.body;

    if (name) student.name = name.trim();
    if (dateOfBirth) student.dateOfBirth = String(dateOfBirth).trim();
    if (email !== undefined) student.email = email ? String(email).trim().toLowerCase() : '';
    if (address !== undefined) {
      student.address = typeof address === 'string' ? { street: address } : address;
    }
    if (college !== undefined) student.college = String(college || '').trim();
    if (fatherName !== undefined) student.fatherName = String(fatherName || '').trim();
    if (motherName !== undefined) student.motherName = String(motherName || '').trim();

    if (phone) {
      const cleanPhone = normalizeIndianPhone(phone);
      if (cleanPhone.length === 10) {
        // Check uniqueness if changing
        if (cleanPhone !== student.phone) {
          const duplicate = await Student.findOne({ phone: cleanPhone, _id: { $ne: student._id } });
          if (duplicate) {
            return res.status(400).json({
              success: false,
              message: `Phone number '${cleanPhone}' is already registered to another student.`,
            });
          }
          student.phone = cleanPhone;
        }
      }
    }

    await student.save();

    await recordAuditLog({
      req,
      action: 'STUDENT_UPDATE',
      targetType: 'Student',
      targetId: student._id,
      details: { name: student.name, username: student.username, batchCode: rawBatch },
    });

    return res.status(200).json({
      success: true,
      message: 'Student details updated successfully.',
      student: student.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/teacher/batches/:batchCode/students/:id/status
 * Toggle student active status (deactivate or reactivate)
 */
export async function toggleStudentStatus(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in your assigned batch.',
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

/**
 * DELETE /api/teacher/batches/:batchCode/students/:id
 * Permanently delete a student record in teacher's assigned batch directly from the database
 */
export async function deleteStudent(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in your assigned batch.',
      });
    }

    await Student.findByIdAndDelete(id);
    await revokeAllUserSessions(id, 'account_deleted');

    await recordAuditLog({
      req,
      action: 'STUDENT_DELETE',
      targetType: 'Student',
      targetId: id,
      details: { name: student.name, username: student.username, batchCode: rawBatch },
    });

    return res.status(200).json({
      success: true,
      message: `Student '${student.name}' (@${student.username}) has been permanently deleted from the database.`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/teacher/batches/:batchCode/students/template
 * Download blank Excel template
 */
export async function getExcelTemplate(req, res, next) {
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
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/teacher/batches/:batchCode/students/import
 * Bulk import students via Excel
 */
export async function bulkImportStudents(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an Excel (.xlsx) file.',
      });
    }

    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');

    const parseResult = await parseStudentExcel(req.file.buffer);

    let importedCount = 0;
    let skippedCount = 0;
    const createdAccounts = [];

    for (const validItem of parseResult.validRows) {
      const record = validItem.data;

      // Check duplicate in database by phone or email
      const existing = await Student.findOne({
        $or: [
          { phone: record.phone },
          ...(record.email && record.email !== 'N/A' ? [{ email: record.email }] : []),
        ],
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

      // Check if row has its own valid assigned batch, else use active batch
      let targetBatch = rawBatch;
      if (record.batchCode) {
        const candidate = record.batchCode.trim().toUpperCase();
        const matched = req.user.assignedBatches?.find(
          (b) => b === candidate || b === `BATCH-${candidate}`
        );
        if (matched) targetBatch = matched;
      }
      const targetAcademicYear = targetBatch.replace('BATCH-', '');

      // Generate unique username
      let seq = 0;
      let username = generateStudentUsername(record.name, targetAcademicYear, seq);
      while (await Student.findOne({ username })) {
        seq++;
        username = generateStudentUsername(record.name, targetAcademicYear, seq);
      }

      // Initial password is the student's 10-digit phone number
      const initialPassword = record.phone;
      const passwordHash = await bcrypt.hash(initialPassword, ENV.BCRYPT_SALT_ROUNDS);

      const newStudent = await Student.create({
        name: record.name,
        phone: record.phone,
        dateOfBirth: record.dateOfBirth || 'N/A',
        email: record.email && record.email !== 'N/A' ? record.email : `${username}@student.antariksh.edu.in`,
        address: typeof record.address === 'string' ? { street: record.address } : record.address || { street: 'N/A' },
        college: record.college || 'N/A',
        fatherName: record.fatherName || 'N/A',
        motherName: record.motherName || 'N/A',
        batch: targetAcademicYear,
        batchCode: targetBatch,
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
      targetId: rawBatch,
      details: {
        batchCode: rawBatch,
        totalRows: parseResult.totalRows,
        importedCount,
        skippedCount,
        invalidCount: parseResult.invalidRows.length,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Excel import processed: ${importedCount} created, ${skippedCount} skipped, ${parseResult.invalidRows.length} invalid.`,
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

/**
 * GET /api/teacher/batches/:batchCode/lectures
 * List all lectures in assigned batch (including published and unpublished)
 */
export async function getBatchLectures(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');

    const lectures = await Lecture.find({
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
    })
      .sort({ slNo: 1, _id: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: lectures,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/teacher/batches/:batchCode/lectures
 * Add a lecture to assigned batch
 */
export async function createLecture(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');

    const { slNo, topicName, ytVideoLink, subject, description, isPublished } = req.body;

    if (!slNo || !topicName || !ytVideoLink || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Serial number, topic name, subject, and YouTube video link are required.',
      });
    }

    const ytValidation = validateYouTubeUrl(ytVideoLink);
    if (!ytValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: ytValidation.error || 'Invalid YouTube video URL.',
      });
    }

    // Check duplicate serial number in this batch
    const existing = await Lecture.findOne({
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
      slNo: Number(slNo),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A lecture with serial number #${slNo} already exists in this batch.`,
      });
    }

    const lecture = await Lecture.create({
      slNo: Number(slNo),
      topicName: topicName.trim(),
      ytVideoLink: ytValidation.canonicalUrl,
      subject: subject.trim(),
      description: description ? description.trim() : '',
      batch: academicYear,
      batchCode: rawBatch,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      createdBy: req.user.username,
      lastUpdatedBy: req.user.username,
    });

    await recordAuditLog({
      req,
      action: 'LECTURE_CREATE',
      targetType: 'Lecture',
      targetId: lecture._id,
      details: { topicName: lecture.topicName, slNo: lecture.slNo, batchCode: rawBatch },
    });

    return res.status(201).json({
      success: true,
      message: 'Lecture published successfully.',
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/teacher/batches/:batchCode/lectures/:lectureId
 * Update a lecture in assigned batch
 */
export async function updateLecture(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');
    const { lectureId } = req.params;

    const lecture = await Lecture.findOne({
      _id: lectureId,
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found in your assigned batch.',
      });
    }

    const { slNo, topicName, ytVideoLink, subject, description, isPublished } = req.body;

    if (slNo !== undefined) {
      const numSlNo = Number(slNo);
      if (numSlNo !== lecture.slNo) {
        const conflict = await Lecture.findOne({
          _id: { $ne: lecture._id },
          $or: [{ batchCode: rawBatch }, { batch: academicYear }],
          slNo: numSlNo,
        });
        if (conflict) {
          return res.status(400).json({
            success: false,
            message: `Serial number #${numSlNo} is already used by another lecture in this batch.`,
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
        batchCode: rawBatch,
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

/**
 * DELETE /api/teacher/batches/:batchCode/lectures/:lectureId
 * Remove lecture from assigned batch
 */
export async function deleteLecture(req, res, next) {
  try {
    const rawBatch = req.params.batchCode.trim().toUpperCase();
    const academicYear = rawBatch.replace('BATCH-', '');
    const { lectureId } = req.params;

    const lecture = await Lecture.findOneAndDelete({
      _id: lectureId,
      $or: [{ batchCode: rawBatch }, { batch: academicYear }],
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found in your assigned batch.',
      });
    }

    await recordAuditLog({
      req,
      action: 'LECTURE_DELETE',
      targetType: 'Lecture',
      targetId: lectureId,
      details: { topicName: lecture.topicName, slNo: lecture.slNo, batchCode: rawBatch },
    });

    return res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}
