import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { Student } from '../src/models/Student.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runStudentSeed() {
  console.log('[SEED STUDENTS] Reading student data from data/students directory...');
  const studentsDir = path.join(__dirname, '../data/students');

  if (!fs.existsSync(studentsDir)) {
    throw new Error(`Students directory not found at ${studentsDir}`);
  }

  const studentFiles = fs
    .readdirSync(studentsDir)
    .filter((file) => file.endsWith('.json'))
    .sort();

  console.log(`[SEED STUDENTS] Found ${studentFiles.length} batch files:`, studentFiles);

  let totalUpserted = 0;
  const allExportStudents = [];

  for (const file of studentFiles) {
    const filePath = path.join(studentsDir, file);
    const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`[SEED STUDENTS] Processing ${records.length} records from '${file}'...`);

    for (const record of records) {
      if (!record.name || !record.phone || !record.username) {
        continue;
      }

      const cleanUsername = record.username.trim().toLowerCase();
      const cleanPhone = record.phone.trim();
      // Initial password is student's phone number
      const password = record.initialPassword || cleanPhone;
      const passwordHash = await bcrypt.hash(password, ENV.BCRYPT_SALT_ROUNDS);

      const batchCode = record.batchCode || 'BATCH-CHSE';
      const batchYear = record.batch || batchCode.replace('BATCH-', '');

      await Student.findOneAndUpdate(
        { phone: cleanPhone },
        {
          $set: {
            name: record.name.trim(),
            username: cleanUsername,
            phone: cleanPhone,
            passwordHash,
            dateOfBirth: String(record.dateOfBirth || '01/01/2008').trim(),
            email: record.email || `${cleanUsername}@student.antariksh.edu.in`,
            address: record.address || {
              street: 'Main Road',
              city: 'Brahmapur',
              state: 'Odisha',
              postalCode: '760001',
              country: 'India',
            },
            college: record.college || '',
            fatherName: record.fatherName || '',
            motherName: record.motherName || '',
            batch: batchYear,
            batchCode,
            isActive: record.isActive ?? true,
            mustChangePassword: false,
            temporaryPasswordExpiresAt: null,
          },
        },
        { upsert: true, new: true }
      );

      totalUpserted++;
      allExportStudents.push({
        batchCode,
        name: record.name,
        username: cleanUsername,
        phone: cleanPhone,
        password,
      });
    }
  }

  // Update credentials-export.json
  const exportPath = path.join(__dirname, '../data/credentials-export.json');
  fs.writeFileSync(
    exportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalStudents: allExportStudents.length,
        students: allExportStudents,
      },
      null,
      2
    )
  );

  console.log(`[SEED STUDENTS] Successfully synced ${totalUpserted} students across all cohorts!`);
  console.log(`[SEED STUDENTS] Updated credentials-export.json successfully.`);
}

// Standalone execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(async () => {
      await runStudentSeed();
      await mongoose.disconnect();
      console.log('[SEED STUDENTS] Completed.');
    })
    .catch((err) => {
      console.error('[SEED STUDENTS ERROR]', err);
      process.exit(1);
    });
}
