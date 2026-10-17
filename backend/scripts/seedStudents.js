import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { Student } from '../src/models/Student.js';
import { Lecture } from '../src/models/Lecture.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Generate unique clean username
function generateUsername(name, batch, sequence = 0) {
  const firstName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  const batchShort = batch.slice(-2);
  const suffix = sequence > 0 ? `${sequence}` : '';
  return `aa${batchShort}_${firstName}${suffix}`;
}

// Helper: Generate strong temporary password (e.g. Aa#7x9mK2q)
function generateTempPassword() {
  const randomHex = crypto.randomBytes(4).toString('hex'); // 8 hex chars
  const specialChars = ['!', '@', '#', '$', '%'];
  const special = specialChars[crypto.randomInt(0, specialChars.length)];
  return `Aa${special}${randomHex}`;
}

async function runSeed() {
  console.log('[SEED] Starting Antariksh Academy database seeding...');

  try {
    // 1. Connect to MongoDB
    await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[SEED] Connected to MongoDB.');

    // 2. Discover batch JSON files
    const studentsDir = path.join(__dirname, '../data/students');
    const studentFiles = fs
      .readdirSync(studentsDir)
      .filter((file) => file.endsWith('.json'));

    let totalImported = 0;
    let totalSkipped = 0;
    let totalInvalid = 0;
    const generatedCredentials = [];

    for (const file of studentFiles) {
      const filePath = path.join(studentsDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      let records = [];

      try {
        records = JSON.parse(rawContent);
      } catch (err) {
        console.error(`[SEED ERROR] Could not parse JSON file '${file}':`, err.message);
        continue;
      }

      console.log(`[SEED] Processing ${records.length} student records from '${file}'...`);

      for (const record of records) {
        // Validate required fields
        if (!record.name || !record.phone || !record.dateOfBirth || !record.batch) {
          totalInvalid++;
          continue;
        }

        // Idempotency: Check if student already exists by phone or email or name+batch
        const existingStudent = await Student.findOne({
          $or: [
            { phone: record.phone.trim() },
            ...(record.email ? [{ email: record.email.trim().toLowerCase() }] : []),
            { name: record.name.trim(), batch: record.batch.trim() },
          ],
        });

        if (existingStudent) {
          totalSkipped++;
          continue;
        }

        // Find an unused unique username
        let seq = 0;
        let usernameCandidate = generateUsername(record.name, record.batch, seq);
        while (await Student.findOne({ username: usernameCandidate })) {
          seq++;
          usernameCandidate = generateUsername(record.name, record.batch, seq);
        }

        // Generate temporary password and bcrypt hash
        const tempPassword = generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, ENV.BCRYPT_SALT_ROUNDS);

        const newStudent = new Student({
          name: record.name.trim(),
          username: usernameCandidate,
          passwordHash,
          phone: record.phone.trim(),
          dateOfBirth: record.dateOfBirth.trim(),
          email: record.email ? record.email.trim().toLowerCase() : '',
          address: record.address || {},
          college: record.college || '',
          fatherName: record.fatherName || '',
          motherName: record.motherName || '',
          batch: record.batch.trim(),
          isActive: record.isActive !== undefined ? record.isActive : true,
          mustChangePassword: true,
        });

        await newStudent.save();
        totalImported++;

        // Store generated credential record for local administrator delivery export
        generatedCredentials.push({
          name: record.name,
          batch: record.batch,
          username: usernameCandidate,
          temporaryPassword: tempPassword,
          phone: record.phone,
          note: 'Must change password on first login.',
        });
      }
    }

    // Write generated credentials locally for administrative testing (git-ignored)
    if (generatedCredentials.length > 0) {
      const exportPath = path.join(__dirname, '../data/credentials-export.json');
      fs.writeFileSync(
        exportPath,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            totalAccounts: generatedCredentials.length,
            accounts: generatedCredentials,
          },
          null,
          2
        ),
        'utf-8'
      );
      console.log(
        `[SEED] Generated credentials exported to: ${exportPath} (keep this file secure and private)`
      );
    }

    // 3. Seed sample lectures
    const lecturesFile = path.join(__dirname, '../data/lectures/sample-lectures.json');
    let lecturesImported = 0;
    let lecturesSkipped = 0;

    if (fs.existsSync(lecturesFile)) {
      const rawLectures = fs.readFileSync(lecturesFile, 'utf-8');
      const lectureRecords = JSON.parse(rawLectures);

      for (const lec of lectureRecords) {
        const existing = await Lecture.findOne({
          batch: lec.batch,
          slNo: lec.slNo,
        });

        if (existing) {
          lecturesSkipped++;
          continue;
        }

        await Lecture.create(lec);
        lecturesImported++;
      }
      console.log(
        `[SEED] Lectures: ${lecturesImported} imported, ${lecturesSkipped} skipped (already existing).`
      );
    }

    console.log('\n================ SEED SUMMARY ================');
    console.log(`Students imported: ${totalImported}`);
    console.log(`Students skipped (already existing): ${totalSkipped}`);
    console.log(`Invalid records: ${totalInvalid}`);
    console.log(`Total active students in DB: ${await Student.countDocuments()}`);
    console.log(`Total lectures in DB: ${await Lecture.countDocuments()}`);
    console.log('==============================================\n');
  } catch (error) {
    console.error('[SEED FATAL ERROR]:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[SEED] Disconnected from MongoDB.');
  }
}

runSeed();
