import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Generate a signed JWT for an authenticated user (student, teacher, superadmin)
 */
export function generateToken(user) {
  const payload = {
    sub: user._id.toString(),
    username: user.username,
    role: user.role || 'student',
    batch: user.batch || '',
    batchCode: user.batchCode || '',
    assignedBatches: user.assignedBatches || [],
    mustChangePassword: !!user.mustChangePassword,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch {
    return null;
  }
}
