import { Lecture } from '../models/Lecture.js';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtube.js';

const PAGE_SIZE = 10;

/**
 * GET /api/lectures
 * Retrieve batch-filtered, published lectures with 10-per-page pagination
 */
export async function getLectures(req, res, next) {
  try {
    const studentBatch = req.student.batch;

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

    const studentBatchCode =
      req.student.batchCode ||
      (studentBatch && studentBatch.startsWith('BATCH-')
        ? studentBatch
        : `BATCH-${studentBatch}`);

    // Filter criteria: Authenticated student's batch ONLY & isPublished: true
    const filter = {
      $or: [
        { batch: studentBatch },
        { batchCode: studentBatchCode },
        { batchCode: studentBatch },
        { batch: studentBatchCode },
      ],
      isPublished: true,
    };

    // Optional subject filter
    if (req.query.subject && typeof req.query.subject === 'string' && req.query.subject.trim() !== '') {
      filter.subject = req.query.subject.trim();
    }

    // Optional topic search
    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.topicName = searchRegex;
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
      batch: studentBatch,
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
 * Retrieve single lecture details ensuring it belongs to the student's batch and is published
 */
export async function getLectureById(req, res, next) {
  try {
    const { id } = req.params;
    const studentBatch = req.student.batch;

    const studentBatchCode =
      req.student.batchCode ||
      (studentBatch && studentBatch.startsWith('BATCH-')
        ? studentBatch
        : `BATCH-${studentBatch}`);

    const lecture = await Lecture.findOne({
      _id: id,
      $or: [
        { batch: studentBatch },
        { batchCode: studentBatchCode },
        { batchCode: studentBatch },
        { batch: studentBatchCode },
      ],
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
 * Retrieve list of distinct subjects available in this batch
 */
export async function getBatchSubjects(req, res, next) {
  try {
    const studentBatch = req.student.batch;

    const subjects = await Lecture.distinct('subject', {
      batch: studentBatch,
      isPublished: true,
    });

    return res.status(200).json({
      success: true,
      data: subjects.sort(),
    });
  } catch (error) {
    next(error);
  }
}
