/**
 * Normalizes an Indian phone number by stripping leading +91, 91, or 0,
 * and ensuring only digits remain.
 * @param {string|number} phone
 * @returns {string} 10-digit phone string, or cleaned string
 */
export function normalizeIndianPhone(phone) {
  if (!phone) return '';
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (clean.length === 12 && clean.startsWith('91')) {
    clean = clean.slice(2);
  } else if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }
  return clean;
}
