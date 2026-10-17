/**
 * Formats a student's full name into a standardized lowercase dot-delimited username.
 * Example: "Swati Biswal" -> "swati.biswal"
 * Example: "Druti Sundar Nayak" -> "druti.sundar.nayak"
 * 
 * If a sequence is provided (for disambiguating duplicate names), it appends the sequence number.
 * Example: "swati.biswal1"
 */
export function formatStudentUsername(name, sequence = 0) {
  if (!name || typeof name !== 'string') {
    return `student${sequence > 0 ? sequence : ''}`;
  }

  // Remove leading/trailing whitespace, convert to lowercase
  const clean = name
    .toLowerCase()
    .trim()
    // Replace non-alphanumeric characters (except spaces) with nothing
    .replace(/[^a-z0-9\s]/g, '')
    // Replace contiguous spaces with a single dot '.'
    .replace(/\s+/g, '.');

  const suffix = sequence > 0 ? `${sequence}` : '';
  const finalUsername = `${clean}${suffix}`;

  // Fallback if empty
  return finalUsername || `student${sequence > 0 ? sequence : ''}`;
}
