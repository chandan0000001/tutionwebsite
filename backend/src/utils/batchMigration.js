import { Student } from '../models/Student.js';
import { Batch } from '../models/Batch.js';

/**
 * Idempotent migration helper: Ensures all existing student records
 * have their legacy single `batch` / `batchCode` migrated into the normalized
 * `batchIds` (ObjectId references) and `batchCodes` arrays without losing data.
 */
export async function migrateStudentBatches() {
  try {
    const batches = await Batch.find().lean();
    if (!batches || batches.length === 0) {
      return { migratedCount: 0, totalStudents: 0 };
    }

    const batchCodeMap = new Map();
    for (const b of batches) {
      batchCodeMap.set(b.code.toUpperCase(), b);
      if (b.academicYear) {
        batchCodeMap.set(b.academicYear.toUpperCase(), b);
        batchCodeMap.set(`BATCH-${b.academicYear.toUpperCase()}`, b);
      }
    }

    // Find students where batchIds is empty or missing
    const students = await Student.find({
      $or: [
        { batchIds: { $exists: false } },
        { batchIds: { $size: 0 } },
        { batchCodes: { $exists: false } },
        { batchCodes: { $size: 0 } },
      ],
    });

    let migratedCount = 0;

    for (const student of students) {
      const targetCode = (student.batchCode || (student.batch ? `BATCH-${student.batch}` : '')).toUpperCase();
      const matchedBatch = batchCodeMap.get(targetCode) || batchCodeMap.get(student.batch?.toUpperCase());

      if (matchedBatch) {
        student.batchIds = [matchedBatch._id];
        student.batchCodes = [matchedBatch.code];
        student.batchCode = matchedBatch.code;
        student.batch = matchedBatch.academicYear || matchedBatch.code.replace('BATCH-', '');
        await student.save();
        migratedCount++;
      }
    }

    if (migratedCount > 0) {
      console.log(`[BATCH MIGRATION] Migrated ${migratedCount} student(s) to multi-batch relationship.`);
    }

    return { migratedCount, totalStudents: students.length };
  } catch (err) {
    console.warn('[BATCH MIGRATION] Warning: Automatic batch migration encountered an issue:', err.message);
    return { migratedCount: 0, error: err.message };
  }
}
