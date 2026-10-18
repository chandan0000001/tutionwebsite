import mongoose from 'mongoose';
import { Lecture } from '../models/Lecture.js';
import { Batch } from '../models/Batch.js';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube.js';
import { createSafeSearchRegex } from '../utils/sanitizeSearch.js';

const PAGE_SIZE = 10;

/**
 * Helper: Extract student's authorized batch codes from record
 */
function getStudentEnrolledCodes(student) {
  const codes = new Set();
  if (Array.isArray(student.batchCodes)) {
    student.batchCodes.forEach((c) => codes.add(String(c).trim().toUpperCase()));
  }
  if (student.batchCode) {
    codes.add(String(student.batchCode).trim().toUpperCase());
  }
  if (student.batch) {
    const raw = String(student.batch).trim().toUpperCase();
    codes.add(raw.startsWith('BATCH-') ? raw : `BATCH-${raw}`);
  }
  return Array.from(codes).filter(Boolean);
}

/**
 * GET /api/lectures
 * Retrieve batch-filtered, published lectures with 10-per-page pagination.
 * Supports multi-batch student enrollment with batch switching and verification.
 */
export async function getLectures(req, res, next) {
  try {
    const enrolledCodes = getStudentEnrolledCodes(req.student);
    if (enrolledCodes.length === 0) {
      return res.status(200).json({
        success: true,
        batch: '',
        batchCode: '',
        enrolledBatches: [],
        pagination: {
          totalRecords: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize: PAGE_SIZE,
          hasNextPage: false,
          hasPrevPage: false,
        },
        data: [],
      });
    }

    // Load full batch documents for student's enrolled batches
    const enrolledBatchDocs = await Batch.find({
      $or: [
        { code: { $in: enrolledCodes } },
        { academicYear: { $in: enrolledCodes.map((c) => c.replace('BATCH-', '')) } },
      ],
      isActive: true,
    }).select('_id code name academicYear courseName').lean();

    // Determine target batch
    let selectedBatchCode = '';
    const requestedBatch = (req.query.batchCode || req.query.batch || req.query.batchId || '').trim();

    if (requestedBatch) {
      // Validate requested batch against student's enrolled batches
      let matchedDoc = null;
      if (mongoose.Types.ObjectId.isValid(requestedBatch)) {
        matchedDoc = enrolledBatchDocs.find((b) => b._id.toString() === requestedBatch);
      }
      if (!matchedDoc) {
        const cleanReq = requestedBatch.toUpperCase();
        matchedDoc = enrolledBatchDocs.find(
          (b) =>
            b.code.toUpperCase() === cleanReq ||
            b.code.toUpperCase() === `BATCH-${cleanReq}` ||
            b.academicYear.toUpperCase() === cleanReq.replace('BATCH-', '')
        );
      }

      if (!matchedDoc) {
        return res.status(403).json({
          success: false,
          message: `Access denied: You are not enrolled in batch '${requestedBatch}'.`,
        });
      }
      selectedBatchCode = matchedDoc.code;
    } else {
      // Default to student's primary batch or first enrolled batch
      if (req.student.batchCode && enrolledCodes.includes(req.student.batchCode.toUpperCase())) {
        selectedBatchCode = req.student.batchCode.toUpperCase();
      } else {
        selectedBatchCode = enrolledCodes[0];
      }
    }

    const academicYear = selectedBatchCode.replace('BATCH-', '');

    // Parse and sanitize query parameters
    let page = parseInt(req.query.page || '1', 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    // Limit is strictly capped at 10 for students
    let limit = parseInt(req.query.limit || `${PAGE_SIZE}`, 10);
    if (isNaN(limit) || limit < 1 || limit > PAGE_SIZE) {
      limit = PAGE_SIZE;
    }

    // Filter criteria: ONLY selected authorized batch & isPublished: true
    const filter = {
      $or: [
        { batch: academicYear },
        { batchCode: selectedBatchCode },
        { batchCode: academicYear },
        { batch: selectedBatchCode },
      ],
      isPublished: true,
    };

    // Optional subject filter
    if (req.query.subject && typeof req.query.subject === 'string' && req.query.subject.trim() !== '') {
      filter.subject = req.query.subject.trim();
    }

    // Optional topic search
    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim() !== '') {
      const searchRegex = createSafeSearchRegex(req.query.search);
      if (searchRegex) {
        filter.topicName = searchRegex;
      }
    }

    // Count total matching records
    const totalRecords = await Lecture.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    // Ensure requested page does not exceed totalPages if records exist
    if (totalRecords > 0 && page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * limit;

    // Stable sort: by serial number ascending, then _id
    const rawLectures = await Lecture.find(filter)
      .sort({ slNo: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Enhance lectures with safe video metadata
    const lectures = rawLectures.map((item) => ({
      ...item,
      videoId: extractYouTubeId(item.ytVideoLink),
      embedUrl: getYouTubeEmbedUrl(item.ytVideoLink),
    }));

    return res.status(200).json({
      success: true,
      batch: academicYear,
      batchCode: selectedBatchCode,
      enrolledBatches: enrolledBatchDocs,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: lectures,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/lectures/:id
 * Retrieve single lecture details ensuring it belongs to one of student's enrolled batches and is published
 */
export async function getLectureById(req, res, next) {
  try {
    const { id } = req.params;
    const enrolledCodes = getStudentEnrolledCodes(req.student);

    if (enrolledCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found or not accessible to your batch.',
      });
    }

    const batchOrConditions = [];
    enrolledCodes.forEach((code) => {
      const year = code.replace('BATCH-', '');
      batchOrConditions.push({ batch: code });
      batchOrConditions.push({ batchCode: code });
      batchOrConditions.push({ batch: year });
      batchOrConditions.push({ batchCode: `BATCH-${year}` });
    });

    const lecture = await Lecture.findOne({
      _id: id,
      $or: batchOrConditions,
      isPublished: true,
    }).lean();

    if (!lecture) {
      // 404: Never reveal if the lecture exists in another batch or is unpublished
      return res.status(404).json({
        success: false,
        message: 'Lecture not found or not accessible to your batch.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...lecture,
        videoId: extractYouTubeId(lecture.ytVideoLink),
        embedUrl: getYouTubeEmbedUrl(lecture.ytVideoLink),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/lectures/subjects
 * Retrieve list of distinct subjects available in selected batch or enrolled batches
 */
export async function getBatchSubjects(req, res, next) {
  try {
    const enrolledCodes = getStudentEnrolledCodes(req.student);
    const requestedBatch = (req.query.batchCode || req.query.batch || '').trim().toUpperCase();

    let targetCodes = enrolledCodes;
    if (requestedBatch) {
      const isEnrolled = enrolledCodes.some(
        (c) => c === requestedBatch || c === `BATCH-${requestedBatch}` || c.replace('BATCH-', '') === requestedBatch
      );
      if (!isEnrolled) {
        return res.status(403).json({
          success: false,
          message: `Access denied: You are not enrolled in batch '${requestedBatch}'.`,
        });
      }
      targetCodes = [requestedBatch, `BATCH-${requestedBatch}`, requestedBatch.replace('BATCH-', '')];
    }

    const subjects = await Lecture.distinct('subject', {
      $or: [
        { batchCode: { $in: targetCodes } },
        { batch: { $in: targetCodes.map((c) => c.replace('BATCH-', '')) } },
      ],
      isPublished: true,
    });

    return res.status(200).json({
      success: true,
      data: subjects.filter(Boolean).sort(),
    });
  } catch (error) {
    next(error);
  }
}
