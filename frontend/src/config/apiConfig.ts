/**
 * Antariksh Academy - API Configuration
 * 
 * Centralized client-side API configuration pointing to the Node.js backend.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:5000/api';
