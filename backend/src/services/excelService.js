import ExcelJS from 'exceljs';

export const CANONICAL_HEADERS = [
  'name',
  'phone',
  'dateOfBirth',
  'email',
  'address',
  'college',
  'fatherName',
  'motherName',
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
  });

  const sampleRow = worksheet.getRow(2);
  sampleRow.font = { italic: true, color: { argb: 'FF555555' } };

  // Generate buffer
  return await workbook.xlsx.writeBuffer();
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

  // 1. Identify header mapping from row 1
  const headerRow = worksheet.getRow(1);
  const colIndexToKey = {};
  const foundHeaders = new Set();

  headerRow.eachCell((cell, colNumber) => {
    const rawVal = String(cell.value || '').trim();
    // Normalize header string (remove spaces, camelCase or lowercase)
    const normalized = rawVal.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const canonical of CANONICAL_HEADERS) {
      if (normalized === canonical.toLowerCase()) {
        colIndexToKey[colNumber] = canonical;
        foundHeaders.add(canonical);
        break;
      }
    }
  });

  // Verify critical headers exist
  const missingCritical = ['name', 'phone', 'dateOfBirth'].filter(
    (h) => !foundHeaders.has(h)
  );
  if (missingCritical.length > 0) {
    throw new Error(
      `Missing required column header(s): ${missingCritical.join(', ')}. Please use the canonical Excel template.`
    );
  }

  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];
  const seenPhones = new Set();
  const seenEmails = new Set();

  // 2. Iterate data rows starting from row 2
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

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
    const cleanPhone = String(rowData.phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.push('Phone number must be a valid 10-digit Indian mobile number');
    } else {
      rowData.phone = cleanPhone;
    }

    // Validation: Date of Birth
    if (!rowData.dateOfBirth) {
      errors.push('Date of birth is required (format: YYYY-MM-DD)');
    }

    // Validation: Email format if provided
    if (rowData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rowData.email)) {
        errors.push('Invalid email address format');
      } else {
        rowData.email = rowData.email.toLowerCase();
      }
    }

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
