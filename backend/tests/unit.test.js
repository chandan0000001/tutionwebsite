import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../src/utils/youtube.js';
import { generateToken, verifyToken } from '../src/utils/token.js';

describe('YouTube Utilities', () => {
  test('extracts ID from standard watch URL', () => {
    const id = extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.equal(id, 'dQw4w9WgXcQ');
  });

  test('extracts ID from shortened youtu.be URL', () => {
    const id = extractYouTubeId('https://youtu.be/dQw4w9WgXcQ');
    assert.equal(id, 'dQw4w9WgXcQ');
  });

  test('extracts ID from embed URL', () => {
    const id = extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ');
    assert.equal(id, 'dQw4w9WgXcQ');
  });

  test('handles direct 11-char ID', () => {
    const id = extractYouTubeId('dQw4w9WgXcQ');
    assert.equal(id, 'dQw4w9WgXcQ');
  });

  test('returns null for invalid or empty URL', () => {
    assert.equal(extractYouTubeId(''), null);
    assert.equal(extractYouTubeId(null), null);
    assert.equal(extractYouTubeId('not-a-valid-video-link'), null);
  });

  test('generates secure embed URL', () => {
    const embedUrl = getYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.equal(embedUrl, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1');
  });
});

describe('Token Utilities', () => {
  const mockStudent = {
    _id: '654321654321654321654321',
    username: 'aa26_aarav',
    batch: '2026',
    batchCode: 'BATCH-2026',
    role: 'student',
    mustChangePassword: true,
  };

  const mockTeacher = {
    _id: '654321654321654321654322',
    username: 'aa_teacher_subrat',
    role: 'teacher',
    assignedBatches: ['BATCH-2026', 'BATCH-2027'],
    mustChangePassword: false,
  };

  const mockSuperadmin = {
    _id: '654321654321654321654323',
    username: 'aa_superadmin',
    role: 'superadmin',
    assignedBatches: ['*'],
    mustChangePassword: false,
  };

  test('generates and verifies valid student JWT', () => {
    const token = generateToken(mockStudent);
    assert.ok(typeof token === 'string' && token.length > 20);

    const decoded = verifyToken(token);
    assert.ok(decoded);
    assert.equal(decoded.sub, mockStudent._id);
    assert.equal(decoded.username, mockStudent.username);
    assert.equal(decoded.role, 'student');
    assert.equal(decoded.batch, mockStudent.batch);
    assert.equal(decoded.mustChangePassword, true);
  });

  test('generates and verifies teacher JWT with assignedBatches', () => {
    const token = generateToken(mockTeacher);
    const decoded = verifyToken(token);
    assert.ok(decoded);
    assert.equal(decoded.sub, mockTeacher._id);
    assert.equal(decoded.username, mockTeacher.username);
    assert.equal(decoded.role, 'teacher');
    assert.deepEqual(decoded.assignedBatches, ['BATCH-2026', 'BATCH-2027']);
    assert.equal(decoded.mustChangePassword, false);
  });

  test('generates and verifies superadmin JWT', () => {
    const token = generateToken(mockSuperadmin);
    const decoded = verifyToken(token);
    assert.ok(decoded);
    assert.equal(decoded.sub, mockSuperadmin._id);
    assert.equal(decoded.role, 'superadmin');
  });

  test('rejects tampered token', () => {
    const token = generateToken(mockStudent);
    const tampered = token.slice(0, -5) + 'xxxxx';
    const decoded = verifyToken(tampered);
    assert.equal(decoded, null);
  });

  test('rejects null or empty token', () => {
    assert.equal(verifyToken(null), null);
    assert.equal(verifyToken(''), null);
  });
});

import { generateStudentTemplate, parseStudentExcel, CANONICAL_HEADERS } from '../src/services/excelService.js';
import ExcelJS from 'exceljs';

describe('Excel Student Import & Template Service', () => {
  test('generates a valid binary Excel (.xlsx) buffer with canonical headers', async () => {
    const buffer = await generateStudentTemplate();
    assert.ok(Buffer.isBuffer(buffer) || buffer instanceof Uint8Array);
    assert.ok(buffer.length > 1000);

    // Verify it loads with ExcelJS and contains the canonical columns
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);
    const ws = wb.worksheets[0];
    assert.ok(ws);

    const headerRow = ws.getRow(1);
    const headers = [];
    headerRow.eachCell((cell) => headers.push(String(cell.value || '').trim()));

    for (const h of CANONICAL_HEADERS) {
      assert.ok(headers.includes(h), `Missing canonical header: ${h}`);
    }
  });

  test('parses and validates valid student rows from generated template', async () => {
    const buffer = await generateStudentTemplate();
    const result = await parseStudentExcel(buffer);

    assert.ok(result.totalRows >= 1);
    assert.equal(result.validRows.length, 1);
    assert.equal(result.invalidRows.length, 0);
    assert.equal(result.duplicateRows.length, 0);

    const sample = result.validRows[0].data;
    assert.equal(sample.name, 'Aarav Kumar Sahu');
    assert.equal(sample.phone, '9437000101');
    assert.equal(sample.dateOfBirth, '2008-04-12');
  });

  test('identifies invalid rows (e.g. invalid phone number, missing name)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Students');
    ws.addRow(CANONICAL_HEADERS);

    // Invalid row 1: missing name
    ws.addRow(['', '9437000102', '2008-01-01', 'test@example.com']);
    // Invalid row 2: invalid phone (only 5 digits)
    ws.addRow(['Pooja Mishra', '12345', '2008-01-01', 'pooja@example.com']);
    // Valid row
    ws.addRow(['Pooja Mishra', '9437000103', '2008-01-01', 'pooja@example.com']);

    const buffer = await wb.xlsx.writeBuffer();
    const result = await parseStudentExcel(buffer);

    assert.equal(result.validRows.length, 1);
    assert.equal(result.invalidRows.length, 2);
    assert.equal(result.validRows[0].data.name, 'Pooja Mishra');
  });

  test('detects duplicate phone numbers within spreadsheet', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Students');
    ws.addRow(CANONICAL_HEADERS);

    ws.addRow(['Rohan Panda', '9876543210', '2007-06-15']);
    ws.addRow(['Rohan Duplicate', '9876543210', '2007-08-20']); // same phone

    const buffer = await wb.xlsx.writeBuffer();
    const result = await parseStudentExcel(buffer);

    assert.equal(result.validRows.length, 1);
    assert.equal(result.duplicateRows.length, 1);
    assert.ok(result.duplicateRows[0].reason.includes('Duplicate phone'));
  });

  test('throws descriptive error if critical headers are missing', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Broken');
    ws.addRow(['randomHeader1', 'randomHeader2']);
    ws.addRow(['John', '123']);

    const buffer = await wb.xlsx.writeBuffer();
    await assert.rejects(
      async () => await parseStudentExcel(buffer),
      /Missing required column header/
    );
  });
});

import { Student } from '../src/models/Student.js';

describe('Student Multi-Batch Model & Normalization', () => {
  test('normalizes, uppercases, and deduplicates multiple batchCodes on pre-save hook', async () => {
    const student = new Student({
      name: 'Rohan Sharma',
      username: 'rohan.sharma',
      passwordHash: 'dummy_hash_123',
      phone: '9876543210',
      dateOfBirth: '2008-05-15',
      batchCodes: ['batch-2026', 'BATCH-NEET', 'batch-2026', '  batch-foundation  '],
    });

    // Execute validate or pre-save normalization
    await new Promise((resolve, reject) => {
      // Find the pre-save hook registered on studentSchema
      student.$__schema.s.hooks.execPre('save', student, [student], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    assert.deepEqual(student.batchCodes, ['BATCH-2026', 'BATCH-NEET', 'BATCH-FOUNDATION']);
    assert.equal(student.batchCode, 'BATCH-2026');
    assert.equal(student.batch, '2026');
  });

  test('toSafeObject strips passwordHash and includes batchCodes array', () => {
    const student = new Student({
      name: 'Priya Das',
      username: 'priya.das',
      passwordHash: '$2b$12$SuperSecretHashedPassword',
      phone: '9876543211',
      dateOfBirth: '2008-06-20',
      batchCodes: ['BATCH-2026', 'BATCH-NEET'],
      batchCode: 'BATCH-2026',
      batch: '2026',
    });

    const safeObj = student.toSafeObject();
    assert.equal(safeObj.passwordHash, undefined);
    assert.deepEqual(safeObj.batchCodes, ['BATCH-2026', 'BATCH-NEET']);
    assert.equal(safeObj.name, 'Priya Das');
  });
});

import { AuditLog } from '../src/models/AuditLog.js';
import { recordAuditLog } from '../src/utils/auditLogger.js';

describe('AuditLog Model & Audit Logger Resilience', () => {
  test('AuditLog schema accepts uppercase role and normalizes to lowercase', async () => {
    const log = new AuditLog({
      actorUsername: 'aa_superadmin',
      actorRole: 'SUPERADMIN',
      action: 'STUDENT_BATCH_ASSIGN',
      targetType: 'Student',
      targetId: '654321654321654321654321',
    });

    await log.validate();
    assert.equal(log.actorRole, 'superadmin');
    assert.equal(log.action, 'STUDENT_BATCH_ASSIGN');
    assert.ok(log.actorId);
  });

  test('AuditLog schema auto-generates actorId when not explicitly passed', async () => {
    const log = new AuditLog({
      actorUsername: 'system',
      actorRole: 'system',
      action: 'BATCH_MIGRATION',
      targetType: 'Batch',
    });

    await log.validate();
    assert.ok(log.actorId);
    assert.equal(log.actorUsername, 'system');
  });

  test('AuditLog schema normalizes lowercase action string to uppercase', async () => {
    const log = new AuditLog({
      actorUsername: 'aa_superadmin',
      actorRole: 'superadmin',
      action: 'student_batch_remove',
      targetType: 'Student',
    });

    await log.validate();
    assert.equal(log.action, 'STUDENT_BATCH_REMOVE');
  });

  test('recordAuditLog strips passwords, tokens, and hashes from details', async () => {
    // Mock AuditLog.create to verify sanitization
    const originalCreate = AuditLog.create;
    let capturedPayload = null;
    AuditLog.create = async (payload) => {
      capturedPayload = payload;
      return payload;
    };

    try {
      await recordAuditLog({
        actor: {
          _id: '654321654321654321654321',
          username: 'aa_superadmin',
          role: 'ADMIN', // Should normalize to superadmin
        },
        action: 'student_create',
        targetType: 'Student',
        targetId: '654321654321654321654322',
        details: {
          name: 'Test Student',
          phone: '9876543210',
          password: 'secretPassword123',
          passwordHash: '$2b$12$hashedPassword',
          temporaryPassword: 'temp123',
          token: 'jwt.token.string',
        },
      });

      assert.ok(capturedPayload);
      assert.equal(capturedPayload.action, 'STUDENT_CREATE');
      assert.equal(capturedPayload.actorRole, 'superadmin');
      assert.equal(capturedPayload.details.name, 'Test Student');
      assert.equal(capturedPayload.details.phone, '9876543210');
      assert.equal(capturedPayload.details.password, undefined);
      assert.equal(capturedPayload.details.passwordHash, undefined);
      assert.equal(capturedPayload.details.temporaryPassword, undefined);
      assert.equal(capturedPayload.details.token, undefined);
    } finally {
      AuditLog.create = originalCreate;
    }
  });
});



