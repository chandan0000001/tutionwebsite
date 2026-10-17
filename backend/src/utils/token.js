import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Generate a signed JWT for an authenticated user (student, teacher, superadmin).
 * Embeds subject, role, tokenVersion, and optional session ID (sid) for stateful invalidation.
 *
 * @param {object} user
 * @param {string|null} [sessionId=null]
 * @returns {string} Signed JWT
 */
export function generateToken(user, sessionId = null) {
  const payload = {
    sub: user._id.toString(),
    username: user.username,
    role: user.role || 'student',
    batch: user.batch || '',
    batchCode: user.batchCode || '',
    assignedBatches: user.assignedBatches || [],
    mustChangePassword: !!user.mustChangePassword,
    tokenVersion: user.tokenVersion || 1,
    ...(sessionId ? { sid: sessionId } : {}),
  };

  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token.
 * Returns decoded payload if valid, null otherwise.
 *
 * @param {string} token
 * @returns {object|null}
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch {
    return null;
  }
}
