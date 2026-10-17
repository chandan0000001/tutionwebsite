import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { Batch } from '../src/models/Batch.js';
import { Staff } from '../src/models/Staff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateNumeric8DigitPassword() {
  return `${crypto.randomInt(10000000, 99999999)}`;
}

async function runStaffSeed() {
  console.log('[SEED] Initializing Antariksh Academy Staff & Superadmin bootstrap...');

  try {
    await mongoose.connect(ENV.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('[SEED] Connected to MongoDB.');

    // 1. Ensure Standard Batches Exist
    const initialBatches = [
      {
        name: 'Batch 2026',
        code: 'BATCH-2026',
        academicYear: '2026',
        description: '+2 2nd Year Science & Entrance Revision (CHSE / JEE / NEET)',
        isActive: true,
      },
      {
        name: 'Batch 2027',
        code: 'BATCH-2027',
        academicYear: '2027',
        description: '+2 1st Year Science Foundation & Concept Mastery',
        isActive: true,
      },
    ];

    for (const b of initialBatches) {
      const existing = await Batch.findOne({ code: b.code });
      if (!existing) {
        await Batch.create(b);
        console.log(`[SEED] Created Batch: ${b.code} (${b.name})`);
      }
    }

    const createdStaff = [];

    // 2. Bootstrap Superadmin Account
    const superadminUsername = 'aa_superadmin';
    const existingSuperadmin = await Staff.findOne({ username: superadminUsername });

    if (!existingSuperadmin) {
      const tempPassword = generateNumeric8DigitPassword();
      const passwordHash = await bcrypt.hash(tempPassword, ENV.BCRYPT_SALT_ROUNDS);

      const superadmin = await Staff.create({
        name: 'Academy Director & Chief Administrator',
        qualification: 'Academic Leadership & Direction',
        phone: '9861000000',
        email: 'superadmin.antariksh@example.com',
        username: superadminUsername,
        passwordHash,
        role: 'superadmin',
        assignedBatches: ['BATCH-2026', 'BATCH-2027'],
        isActive: true,
        mustChangePassword: true,
      });

      createdStaff.push({
        role: 'SUPERADMIN',
        name: superadmin.name,
        username: superadmin.username,
        temporaryPassword: tempPassword,
        note: 'Superadmin master console account. Must change password upon first sign-in.',
      });
      console.log(`[SEED] Superadmin account '${superadminUsername}' initialized successfully.`);
    } else {
      console.log(`[SEED] Superadmin '${superadminUsername}' already exists. Password preserved.`);
    }

    // 3. Bootstrap 2 Fictional Teacher Accounts
    const teachersSeedData = [
      {
        name: 'Dr. Subrat Tripathy',
        qualification: 'M.Sc. Physics (Utkal University), Ph.D.',
        dateOfBirth: '1984-06-15',
        phone: '9861000001',
        email: 'subrat.tripathy.demo@example.com',
        username: 'aa_teacher_subrat',
        role: 'teacher',
        assignedBatches: ['BATCH-2026', 'BATCH-2027'],
      },
      {
        name: 'Smt. Kalyani Panigrahi',
        qualification: 'M.Sc. Organic Chemistry, B.Ed.',
        dateOfBirth: '1987-10-22',
        phone: '9861000002',
        email: 'kalyani.panigrahi.demo@example.com',
        username: 'aa_teacher_kalyani',
        role: 'teacher',
        assignedBatches: ['BATCH-2026'],
      },
    ];

    for (const t of teachersSeedData) {
      const existingTeacher = await Staff.findOne({ username: t.username });
      if (!existingTeacher) {
        const tempPassword = generateNumeric8DigitPassword();
        const passwordHash = await bcrypt.hash(tempPassword, ENV.BCRYPT_SALT_ROUNDS);

        const teacher = await Staff.create({
          ...t,
          passwordHash,
          isActive: true,
          mustChangePassword: true,
        });

        createdStaff.push({
          role: 'TEACHER',
          name: teacher.name,
          username: teacher.username,
          temporaryPassword: tempPassword,
          assignedBatches: teacher.assignedBatches,
          note: 'Assigned teacher account. Must change password upon first sign-in.',
        });
        console.log(`[SEED] Teacher account '${teacher.username}' initialized successfully.`);
      } else {
        console.log(`[SEED] Teacher '${t.username}' already exists. Password preserved.`);
      }
    }

    // Output formatted credentials box once if new accounts were created
    if (createdStaff.length > 0) {
      const exportPath = path.join(__dirname, '../data/credentials-export-staff.json');
      fs.writeFileSync(
        exportPath,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            totalAccounts: createdStaff.length,
            accounts: createdStaff,
          },
          null,
          2
        ),
        'utf-8'
      );

      console.log('\n========================================================================');
      console.log('           ONE-TIME GENERATED STAFF & ADMIN CREDENTIALS                 ');
      console.log('  WARNING: Do not share or commit these credentials to Git.             ');
      console.log('  All accounts are flagged with mustChangePassword: true.               ');
      console.log('========================================================================');
      for (const item of createdStaff) {
        console.log(`[${item.role}] ${item.name}`);
        console.log(`  Username:           ${item.username}`);
        console.log(`  Temporary Password: ${item.temporaryPassword}`);
        if (item.assignedBatches) {
          console.log(`  Assigned Batches:   ${item.assignedBatches.join(', ')}`);
        }
        console.log('------------------------------------------------------------------------');
      }
      console.log(`Credentials also written to: ${exportPath} (git-ignored)`);
      console.log('========================================================================\n');
    } else {
      console.log('[SEED] All staff and admin accounts already present. No new passwords generated.');
    }
  } catch (error) {
    console.error('[SEED FATAL ERROR]:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[SEED] Disconnected from MongoDB.');
  }
}

runStaffSeed();
