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
    
    // Resolve initial password securely from environment or fallback
    let initialPassword = '';
    if (s.role === 'superadmin') {
      initialPassword =
        ENV.SUPERADMIN_DEFAULT_PASSWORD ||
        process.env.SUPERADMIN_DEFAULT_PASSWORD ||
        s.initialPassword ||
        'SuperAdmin@Antariksh2026';
    } else {
      initialPassword =
        ENV.TEACHER_DEFAULT_PASSWORD ||
        process.env.TEACHER_DEFAULT_PASSWORD ||
        s.initialPassword ||
        (cleanUsername === 'sudeepdash'
          ? 'sudeep@Accademy01'
          : cleanUsername === 'prasantbehera'
          ? 'prasant@Accademy02'
          : 'Teacher@Antariksh2026');
    }

    const passwordHash = await bcrypt.hash(initialPassword, ENV.BCRYPT_SALT_ROUNDS);
    const assignedBatches = s.assignedBatches && s.assignedBatches.length > 0 ? s.assignedBatches : allBatchCodes;

    const updated = await Staff.findOneAndUpdate(
      { username: cleanUsername },
      {
        $set: {
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
        },
      },
      { upsert: true, new: true }
    );

    console.log(`[SEED STAFF] Synced ${updated.role.toUpperCase()}: ${updated.name} (@${updated.username})`);

    exportAccounts.push({
      role: updated.role.toUpperCase(),
      name: updated.name,
      username: updated.username,
      phone: updated.phone,
      password: initialPassword,
      assignedBatches: updated.assignedBatches,
      note: updated.role === 'superadmin' ? 'Master administrator account' : 'Faculty mentor account',
    });
  }

  // Deduplicate: remove any stray superadmins other than aa_superadmin
  await Staff.deleteMany({ role: 'superadmin', username: { $ne: 'aa_superadmin' } });

  // Update credentials-export-staff.json
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
  console.log(`[SEED STAFF] Updated credentials-export-staff.json successfully.`);
}

// Standalone execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose
    .connect(ENV.MONGODB_URI)
    .then(async () => {
      await runStaffSeed();
      await mongoose.disconnect();
      console.log('[SEED STAFF] Completed.');
    })
    .catch((err) => {
      console.error('[SEED STAFF ERROR]', err);
      process.exit(1);
    });
}
