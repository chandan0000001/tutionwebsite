/**
 * Sanitize untrusted input for safe use in MongoDB queries.
 * Prevents ReDoS (Regular Expression Denial of Service) and RegExp injection.
 */

/**
 * Escapes all regular expression metacharacters in a string.
 * Limits the length to a safe bounded maximum.
 *
 * @param {string} input - Raw user search input
 * @param {number} [maxLength=64] - Maximum allowed length to prevent ReDoS
 * @returns {string} - Escaped string safe for new RegExp(escaped, 'i')
 */
export function escapeRegex(input, maxLength = 64) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().slice(0, maxLength);
  // Escapes: \ ^ $ * + ? . ( ) | { } [ ]
  return trimmed.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Creates a safe case-insensitive RegExp object from user input.
 * Returns null if input is empty or invalid.
 *
 * @param {string} input
 * @param {number} [maxLength=64]
 * @returns {RegExp | null}
 */
export function createSafeSearchRegex(input, maxLength = 64) {
  const escaped = escapeRegex(input, maxLength);
  if (!escaped) return null;
  return new RegExp(escaped, 'i');
}

/**
 * Sanitizes phone numbers for safe query matching.
 * Extracts digits only and bounds length to 10 digits.
 *
 * @param {string} phone
 * @returns {string}
 */
export function sanitizePhoneSearch(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/\D/g, '').slice(0, 10);
}
