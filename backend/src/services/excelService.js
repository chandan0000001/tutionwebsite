import ExcelJS from 'exceljs';
import { normalizeIndianPhone } from '../utils/phone.js';

export const CANONICAL_HEADERS = [
  'name',
  'phone',
  'dateOfBirth',
  'email',
  'address',
  'college',
  'fatherName',
  'motherName',
  'batchCode',
];

/**
 * Generate a blank Excel template for bulk student import
 */
export async function generateStudentTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antariksh Academy Admissions';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Students Import Template');

  // Column definitions with readable header titles and canonical keys
  worksheet.columns = [
    { header: 'name', key: 'name', width: 25 },
    { header: 'phone', key: 'phone', width: 16 },
    { header: 'dateOfBirth', key: 'dateOfBirth', width: 15 },
    { header: 'email', key: 'email', width: 28 },
    { header: 'address', key: 'address', width: 35 },
    { header: 'college', key: 'college', width: 30 },
    { header: 'fatherName', key: 'fatherName', width: 22 },
    { header: 'motherName', key: 'motherName', width: 22 },
    { header: 'batchCode', key: 'batchCode', width: 20 },
  ];

  // Header styling
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF17365D' }, // Navy theme
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 26;

  // Add sample guidance row
  worksheet.addRow({
    name: 'Aarav Kumar Sahu',
    phone: '9437000101',
    dateOfBirth: '2008-04-12',
    email: 'aarav.sahu@example.com',
    address: 'Giri Road, Near City High School, Brahmapur',
    college: 'Khallikote Junior College',
    fatherName: 'Rajesh Kumar Sahu',
    motherName: 'Sunita Sahu',
    batchCode: 'BATCH-CHSE',
  });

  const sampleRow = worksheet.getRow(2);
  sampleRow.font = { italic: true, color: { argb: 'FF555555' } };

  // Generate buffer
  return await workbook.xlsx.writeBuffer();
}

export const HEADER_SYNONYMS = {
  name: ['name', 'studentname', 'student', 'fullname', 'nameofstudent'],
  phone: ['phone', 'phonenumber', 'mobile', 'mobilenumber', 'contact', 'contactnumber'],
  dateOfBirth: ['dateofbirth', 'dob', 'birthdate', 'birth'],
  email: ['email', 'emailid', 'emailaddress', 'mail'],
  address: ['address', 'street', 'residentialaddress', 'location'],
  college: ['college', 'school', 'institution', 'collegeuniversity', 'institute'],
  fatherName: ['fathername', 'fathersname', 'father'],
  motherName: ['mothername', 'mothersname', 'mother'],
  batchCode: ['batch', 'batchcode', 'course', 'branch', 'stream', 'cohort'],
};

function matchHeaderKey(rawVal) {
  const norm = String(rawVal || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!norm) return null;
  for (const [canonical, synonyms] of Object.entries(HEADER_SYNONYMS)) {
    if (synonyms.includes(norm)) return canonical;
  }
  return null;
}

/**
 * Parse and validate an uploaded Excel file buffer
 */
export async function parseStudentExcel(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Excel workbook contains no readable worksheets.');
  }

  // 1. Identify header mapping by scanning the first 10 rows
  let headerRowNum = -1;
  let colIndexToKey = {};
  let foundHeaders = new Set();

  for (let r = 1; r <= Math.min(worksheet.rowCount, 10); r++) {
    const row = worksheet.getRow(r);
    const candidateMap = {};
    const candidateFound = new Set();

    row.eachCell((cell, colNumber) => {
      const matched = matchHeaderKey(cell.value);
      if (matched) {
        candidateMap[colNumber] = matched;
        candidateFound.add(matched);
      }
    });

    if (candidateFound.has('name') && (candidateFound.has('phone') || candidateFound.has('dateOfBirth'))) {
      headerRowNum = r;
      colIndexToKey = candidateMap;
      foundHeaders = candidateFound;
      break;
    }
  }

  if (headerRowNum === -1) {
    throw new Error(
      'Could not detect student table headers in spreadsheet. Ensure columns include Student Name, Phone Number, and Date of Birth.'
    );
  }

  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];
  const seenPhones = new Set();
  const seenEmails = new Set();

  // 2. Iterate data rows starting after the header row
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNum) return; // Skip header and any pre-header banner rows

    const rowData = {};
    let hasAnyData = false;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const key = colIndexToKey[colNumber];
      if (key) {
        let val = cell.value;
        if (val !== null && val !== undefined) {
          if (typeof val === 'object' && val.text) val = val.text;
          if (val instanceof Date) {
            val = val.toISOString().split('T')[0];
          }
          const str = String(val).trim();
          if (str) {
            rowData[key] = str;
            hasAnyData = true;
          }
        }
      }
    });

    if (!hasAnyData) return; // Skip completely empty rows

    const errors = [];

    // Validation: Name
    if (!rowData.name || rowData.name.length < 2) {
      errors.push('Student name is required (min 2 characters)');
    }

    // Validation: Phone
    const cleanPhone = normalizeIndianPhone(rowData.phone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.push('Phone number must be a valid 10-digit Indian mobile number');
    } else {
      rowData.phone = cleanPhone;
    }

    // Date of Birth: if missing, default to 'N/A' without throwing error
    if (!rowData.dateOfBirth) {
      rowData.dateOfBirth = 'N/A';
    }

    // Email: if missing or invalid format, default to 'N/A' without throwing error
    if (rowData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rowData.email)) {
        rowData.email = 'N/A';
      } else {
        rowData.email = rowData.email.toLowerCase();
      }
    } else {
      rowData.email = 'N/A';
    }

    // Optional fields: default to 'N/A' if empty without throwing error
    if (!rowData.address) rowData.address = 'N/A';
    if (!rowData.college) rowData.college = 'N/A';
    if (!rowData.fatherName) rowData.fatherName = 'N/A';
    if (!rowData.motherName) rowData.motherName = 'N/A';
    if (!rowData.batchCode) rowData.batchCode = '';

    // Duplicate check within sheet
    if (cleanPhone && seenPhones.has(cleanPhone)) {
      duplicateRows.push({
        rowNumber,
        data: rowData,
        reason: `Duplicate phone number '${cleanPhone}' within spreadsheet`,
      });
      return;
    }

    if (rowData.email && seenEmails.has(rowData.email)) {
      duplicateRows.push({
        rowNumber,
        data: rowData,
        reason: `Duplicate email '${rowData.email}' within spreadsheet`,
      });
      return;
    }

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber,
        data: rowData,
        errors,
      });
    } else {
      seenPhones.add(cleanPhone);
      if (rowData.email) seenEmails.add(rowData.email);
      validRows.push({
        rowNumber,
        data: rowData,
      });
    }
  });

  return {
    totalRows: validRows.length + invalidRows.length + duplicateRows.length,
    validRows,
    invalidRows,
    duplicateRows,
  };
}
