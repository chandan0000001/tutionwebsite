import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { Staff } from '../src/models/Staff.js';
import { Batch } from '../src/models/Batch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Idempotent, non-destructive staff seeding script.
 * - Seeds initial superadmin and faculty accounts from environment variables.
 * - NEVER overwrites existing staff passwords if accounts already exist.
 * - NEVER deletes existing superadmin accounts.
 * - Safe to run on every deployment without clobbering credentials.
 */
export async function runStaffSeed() {
  console.log('[SEED STAFF] Loading staff data from data/staff.json...');
  const staffFilePath = path.join(__dirname, '../data/staff.json');

  if (!fs.existsSync(staffFilePath)) {
    throw new Error(`Staff file not found at ${staffFilePath}`);
  }

  const staffData = JSON.parse(fs.readFileSync(staffFilePath, 'utf-8'));
  console.log(`[SEED STAFF] Found ${staffData.length} staff records in data/staff.json.`);

  const allBatches = await Batch.find().select('code');
  const allBatchCodes = allBatches.map((b) => b.code);

  const exportAccounts = [];

  for (const s of staffData) {
    const cleanUsername = s.username.trim().toLowerCase();

    // Check if staff account already exists
    const existing = await Staff.findOne({ username: cleanUsername });

    if (existing) {
      // Idempotent sync: update safe profile metadata only, preserve existing credentials
      existing.name = s.name.trim();
      existing.phone = s.phone.trim();
      if (s.qualification) existing.qualification = s.qualification;
      if (s.dateOfBirth) existing.dateOfBirth = s.dateOfBirth;
      if (s.email) existing.email = s.email;
      existing.role = s.role;
      if (s.assignedBatches && s.assignedBatches.length > 0) {
        existing.assignedBatches = s.assignedBatches;
      }
      await existing.save();

      console.log(
        `[SEED STAFF] Synced existing ${existing.role.toUpperCase()}: ${existing.name} (@${existing.username}) - password unchanged.`
      );

      exportAccounts.push({
        role: existing.role.toUpperCase(),
        name: existing.name,
        username: existing.username,
        phone: existing.phone,
        assignedBatches: existing.assignedBatches,
        status: 'existing',
      });
      continue;
    }

    // Resolve initial password securely from environment variables for new account creation
    let initialPassword = '';
    if (s.role === 'superadmin' || cleanUsername === ENV.SUPERADMIN_USERNAME) {
      initialPassword = ENV.SUPERADMIN_PASSWORD;
    } else if (cleanUsername === ENV.TEACHER_1_USERNAME) {
      initialPassword = ENV.TEACHER_1_PASSWORD;
    } else if (cleanUsername === ENV.TEACHER_2_USERNAME) {
      initialPassword = ENV.TEACHER_2_PASSWORD;
    } else {
      initialPassword = process.env.TEACHER_DEFAULT_PASSWORD || '';
    }

    if (!initialPassword) {
      throw new Error(
        `[SECURITY ERROR] Missing environment password for new staff account '${cleanUsername}'. Please define SUPERADMIN_PASSWORD / TEACHER_1_PASSWORD / TEACHER_2_PASSWORD in .env.`
      );
    }

    const passwordHash = await bcrypt.hash(initialPassword, ENV.BCRYPT_SALT_ROUNDS);
    const assignedBatches =
      s.assignedBatches && s.assignedBatches.length > 0 ? s.assignedBatches : allBatchCodes;

    const created = await Staff.create({
      name: s.name.trim(),
      username: cleanUsername,
      passwordHash,
      phone: s.phone.trim(),
      qualification: s.qualification || '',
      dateOfBirth: s.dateOfBirth || '',
      email: s.email || `${cleanUsername}@antariksh.edu.in`,
      role: s.role,
      assignedBatches,
      isActive: s.isActive ?? true,
      mustChangePassword: false,
      temporaryPasswordExpiresAt: null,
    });

    console.log(
      `[SEED STAFF] Created new ${created.role.toUpperCase()}: ${created.name} (@${created.username})`
    );

    exportAccounts.push({
      role: created.role.toUpperCase(),
      name: created.name,
      username: created.username,
      phone: created.phone,
      assignedBatches: created.assignedBatches,
      status: 'created',
    });
  }

  // Update credentials-export-staff.json with metadata (never store plaintext passwords)
  const exportPath = path.join(__dirname, '../data/credentials-export-staff.json');
  fs.writeFileSync(
    exportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalAccounts: exportAccounts.length,
        accounts: exportAccounts,
      },
      null,
      2
    )
  );
  console.log(`[SEED STAFF] Updated credentials-export-staff.json summary successfully.`);
}

// Standalone execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(async () => {
      await runStaffSeed();
      await mongoose.disconnect();
      console.log('[SEED STAFF] Completed successfully.');
    })
    .catch((err) => {
      console.error('[SEED STAFF ERROR]', err);
      process.exit(1);
    });
}
