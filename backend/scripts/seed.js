import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { Batch } from '../src/models/Batch.js';
import { Lecture } from '../src/models/Lecture.js';
import { runStaffSeed } from './seedStaff.js';
import { runStudentSeed } from './seedStudents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMasterSeed() {
  console.log('[SEED MASTER] Starting comprehensive Antariksh Academy database seed...');
  console.log('[SEED MASTER] Connecting to MongoDB...');
  await mongoose.connect(ENV.MONGODB_URI);
  console.log('[SEED MASTER] Connected successfully.');

  /* -------------------------------------------------------------------------- */
  /* 1. SEED ACADEMIC BATCHES (FROM data/batches.json)                          */
  /* -------------------------------------------------------------------------- */
  console.log('\n[SEED MASTER] 1. Seeding Academic Batches from data/batches.json...');
  const batchesFilePath = path.join(__dirname, '../data/batches.json');
  if (fs.existsSync(batchesFilePath)) {
    const batchesData = JSON.parse(fs.readFileSync(batchesFilePath, 'utf-8'));
    for (const b of batchesData) {
      await Batch.findOneAndUpdate(
        { code: b.code },
        {
          $set: {
            name: b.name,
            code: b.code,
            academicYear: b.academicYear,
            description: b.description,
            isActive: b.isActive ?? true,
            classTiming: b.classTiming,
          },
        },
        { upsert: true, new: true }
      );
      console.log(`  - Synced Batch: ${b.code} (${b.name})`);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 2. SEED STAFF & SUPERADMIN (FROM data/staff.json)                          */
  /* -------------------------------------------------------------------------- */
  console.log('\n[SEED MASTER] 2. Seeding Staff & Faculty from data/staff.json...');
  await runStaffSeed();

  /* -------------------------------------------------------------------------- */
  /* 3. SEED STUDENTS (FROM data/students/*.json)                               */
  /* -------------------------------------------------------------------------- */
  console.log('\n[SEED MASTER] 3. Seeding Students from data/students/*.json...');
  await runStudentSeed();

  /* -------------------------------------------------------------------------- */
  /* 4. SEED SAMPLE LECTURES (FROM data/lectures/sample-lectures.json)          */
  /* -------------------------------------------------------------------------- */
  console.log('\n[SEED MASTER] 4. Seeding Sample Lectures from data/lectures/sample-lectures.json...');
  const lecturesFilePath = path.join(__dirname, '../data/lectures/sample-lectures.json');
  if (fs.existsSync(lecturesFilePath)) {
    const lecturesData = JSON.parse(fs.readFileSync(lecturesFilePath, 'utf-8'));
    for (const l of lecturesData) {
      await Lecture.findOneAndUpdate(
        { batchCode: l.batchCode, slNo: l.slNo },
        {
          $set: {
            slNo: l.slNo,
            topicName: l.topicName,
            ytVideoLink: l.ytVideoLink,
            subject: l.subject,
            description: l.description || '',
            batch: l.batch,
            batchCode: l.batchCode,
            isPublished: l.isPublished ?? true,
          },
        },
        { upsert: true, new: true }
      );
    }
    console.log(`  - Synced ${lecturesData.length} recorded lectures.`);
  }

  console.log('\n[SEED MASTER] Master Seeding Complete! All data loaded cleanly from data/ folder.');
  await mongoose.disconnect();
}

runMasterSeed().catch((err) => {
  console.error('[SEED MASTER ERROR]', err);
  process.exit(1);
});
