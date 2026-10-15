/**
 * Form Validation Utilities for Antariksh Academy
 */

/**
 * Sanitizes phone input: strictly keeps digits only and enforces maximum 10 digits.
 * Automatically handles pasted text with +91 or leading 0.
 */
export function sanitizeMobileInput(input: string): string {
  if (!input) return '';
  // Strip all non-digit characters
  let digits = input.replace(/\D/g, '');

  // If user pasted with country code (+91) resulting in 12 digits starting with 91
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  // Strictly enforce max 10 digits
  return digits.slice(0, 10);
}

/**
 * Validates an Indian mobile number.
 * Returns true if exactly 10 digits and starts with 6, 7, 8, or 9.
 */
export function isValidIndianMobile(phone: string): boolean {
  if (!phone) return false;
  const digits = sanitizeMobileInput(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Provides specific error messages for Indian mobile validation.
 */
export function getMobileValidationError(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Mobile number is required.';
  }
  const digits = sanitizeMobileInput(phone);
  if (digits.length === 0) {
    return 'Please enter numeric digits only.';
  }
  if (digits.length < 10) {
    return `Enter all 10 digits (currently ${digits.length}/10 digits).`;
  }
  if (!/^[6-9]/.test(digits)) {
    return 'Indian mobile numbers must start with 6, 7, 8, or 9.';
  }
  return null;
}

/**
 * Standard email format validation
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates that a date string (YYYY-MM-DD) is not in the past.
 */
export function isFutureOrToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  return target.getTime() >= today.getTime();
}

/**
 * Returns today's date formatted as YYYY-MM-DD for min date inputs
 */
export function getMinDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
