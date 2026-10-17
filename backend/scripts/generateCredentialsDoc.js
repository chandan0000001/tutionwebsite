import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Staff } from '../src/models/Staff.js';
import { Student } from '../src/models/Student.js';

async function generate() {
  await mongoose.connect(process.env.MONGODB_URI);

  const staffMembers = await Staff.find({}).lean();
  const students = await Student.find({}).sort({ batchCode: 1, name: 1 }).lean();

  const lines = [];
  lines.push('# Antariksh Academy - Master Credentials Register');
  lines.push('');
  lines.push('> [!CAUTION]');
  lines.push('> **CONFIDENTIAL & INTERNAL ONLY**: This file contains active system credentials for administrators, faculty, and enrolled students. This file is strictly excluded from Git tracking via `.gitignore` and must NEVER be committed to any public or private repository.');
  lines.push('');
  lines.push(`**Generated At:** ${new Date().toISOString()}`);
  lines.push(`**Total Faculty & Admin Staff:** ${staffMembers.length}`);
  lines.push(`**Total Enrolled Students:** ${students.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 1. Superadmin Credentials');
  lines.push('');
  lines.push('| Name | Username | Password | Role | Phone | Status |');
  lines.push('| :--- | :--- | :--- | :--- | :--- | :--- |');

  const superadmin = staffMembers.find((s) => s.role === 'superadmin');
  if (superadmin) {
    lines.push(
      `| ${superadmin.name} | \`${superadmin.username}\` | \`${process.env.SUPERADMIN_PASSWORD}\` | Super Administrator | ${superadmin.phone} | Active |`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 2. Faculty / Teacher Credentials');
  lines.push('');
  lines.push('| Name | Username | Password | Assigned Batches | Phone | Role |');
  lines.push('| :--- | :--- | :--- | :--- | :--- | :--- |');

  for (const s of staffMembers.filter((s) => s.role === 'teacher')) {
    let pwd = '';
    if (s.username === process.env.TEACHER_1_USERNAME) {
      pwd = process.env.TEACHER_1_PASSWORD;
    } else if (s.username === process.env.TEACHER_2_USERNAME) {
      pwd = process.env.TEACHER_2_PASSWORD;
    } else {
      pwd = '(One-time generated temporary password)';
    }

    const batches = s.assignedBatches && s.assignedBatches.length > 0 ? s.assignedBatches.join(', ') : 'None';
    lines.push(
      `| ${s.name} | \`${s.username}\` | \`${pwd}\` | ${batches} | ${s.phone} | Teacher |`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 3. Student Credentials (By Course / Batch)');
  lines.push('');
  lines.push('> **Note on Student Passwords**: Students can sign in using **either** their 10-digit mobile number OR the combined `username.phoneNum` format.');
  lines.push('');

  const batchNames = {
    'BATCH-CHSE': '+2 Science Odisha CHSE Board',
    'BATCH-JEE': 'JEE Main & JEE Advanced',
    'BATCH-NEET': 'NEET-UG Medical Preparation',
    'BATCH-INTG': 'Integrated Board + Entrance Preparation',
    'BATCH-OUAT-ICAR': 'OUAT & ICAR Preparation',
  };

  const batches = ['BATCH-CHSE', 'BATCH-JEE', 'BATCH-NEET', 'BATCH-INTG', 'BATCH-OUAT-ICAR'];

  for (const b of batches) {
    const batchStudents = students.filter((s) => s.batchCode === b);
    lines.push(`### ${batchNames[b] || b} (\`${b}\`) - (${batchStudents.length} Students)`);
    lines.push('');
    lines.push('| Sl | Student Name | Username | Valid Password 1 (Phone) | Valid Password 2 (username.phone) | College / Institute |');
    lines.push('| :---: | :--- | :--- | :--- | :--- | :--- |');

    batchStudents.forEach((st, idx) => {
      const p1 = st.phone;
      const p2 = `${st.username}.${st.phone}`;
      lines.push(
        `| ${idx + 1} | ${st.name} | \`${st.username}\` | \`${p1}\` | \`${p2}\` | ${st.college || 'N/A'} |`
      );
    });

    lines.push('');
  }

  const outPath = path.resolve(__dirname, '../../ALL_CREDENTIALS.md');
  const content = lines.join('\n');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`[OK] Master credentials file created successfully at: ${outPath}`);
  console.log(`[OK] Total length: ${content.length} characters, Total lines: ${lines.length}`);

  await mongoose.disconnect();
}

generate().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
