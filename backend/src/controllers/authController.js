import bcrypt from 'bcryptjs';
import { Student } from '../models/Student.js';
import { Staff } from '../models/Staff.js';
import { generateToken } from '../utils/token.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { ENV } from '../config/env.js';
import {
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from '../utils/loginRateLimiter.js';
import {
  createSession,
  revokeSession,
  revokeAllUserSessions,
} from '../utils/sessionManager.js';

// Constant-time dummy hash to mitigate username enumeration via timing attacks
const TIMING_SAFE_DUMMY_HASH =
  '$2a$12$e8wEU3Zg4/R9J90eH95Ure4u9O3j6eF7W7xO7Xo19x58qHk7p5K2W';

/**
 * POST /api/auth/login
 * Unified authentication for students, teachers, and superadmins.
 * Enforces distributed rate limiting, generic error responses, timing-safe validation,
 * temporary password expiration, and session binding.
 */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const cleanUsername = String(username || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    // 0. Check Rate Limit
    const rateCheck = await checkLoginRateLimit(req, cleanUsername);
    if (rateCheck.isLocked) {
      return res.status(429).json({
        success: false,
        message: `Too many failed login attempts. Your login access is temporarily restricted for ${rateCheck.remainingSeconds} second${rateCheck.remainingSeconds === 1 ? '' : 's'}. Please wait or contact institute administration.`,
        retryAfter: rateCheck.remainingSeconds,
      });
    }

    // 1. Search Staff (teachers & superadmins) first
    let user = await Staff.findOne({ username: cleanUsername }).select('+passwordHash');

    // 2. If not found in Staff, search Student
    if (!user) {
      user = await Student.findOne({ username: cleanUsername }).select('+passwordHash');
    }

    // If account not found: execute dummy bcrypt comparison for timing-attack resistance
    if (!user) {
      await bcrypt.compare(cleanPassword, TIMING_SAFE_DUMMY_HASH);
      const failResult = await recordFailedLogin(req, cleanUsername);
      if (failResult.lockedNow) {
        return res.status(429).json({
          success: false,
          message: `Too many failed login attempts. Your login access has been restricted for ${failResult.remainingSeconds || 60} seconds. Please wait or contact institute administration.`,
          retryAfter: failResult.remainingSeconds || 60,
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Verify password hash
    let isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);

    // Support legacy student initial login where password was set as phone number
    if (!isMatch && user.role === 'student' && user.phone) {
      if (cleanPassword === `${user.username}.${user.phone}`) {
        isMatch = await bcrypt.compare(user.phone, user.passwordHash);
      } else if (cleanPassword === user.phone) {
        isMatch = await bcrypt.compare(`${user.username}.${user.phone}`, user.passwordHash);
      }
    }

    if (!isMatch) {
      const failResult = await recordFailedLogin(req, cleanUsername);
      if (failResult.lockedNow) {
        return res.status(429).json({
          success: false,
          message: `Too many failed login attempts. Your login access has been restricted for ${failResult.remainingSeconds || 60} seconds. Please wait or contact institute administration.`,
          retryAfter: failResult.remainingSeconds || 60,
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Check account active state
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact institute administration.',
      });
    }

    // Check if temporary password has expired (valid for 1 hour only)
    if (
      user.mustChangePassword &&
      user.temporaryPasswordExpiresAt &&
      new Date() > new Date(user.temporaryPasswordExpiresAt)
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Your temporary password has expired (valid for 1 hour only). Please contact the institute administrator to generate a new password.',
      });
    }

    // Login successful: reset rate limit attempts for this client + username
    await recordSuccessfulLogin(req, cleanUsername);

    // Create a new session in MongoDB
    const sessionId = await createSession({ user, req });

    // Generate signed JWT token embedding sessionId
    const token = generateToken(user, sessionId);
    const safeUser = user.toSafeObject();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      role: user.role || 'student',
      user: safeUser,
      student: user.role === 'student' ? safeUser : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/change-password
 * Change password for authenticated student, teacher, or superadmin.
 * Invalidates all existing sessions upon password change.
 */
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    const role = req.user.role || 'student';

    let user;
    if (role === 'teacher' || role === 'superadmin') {
      user = await Staff.findById(userId).select('+passwordHash');
    } else {
      user = await Student.findById(userId).select('+passwordHash');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect.',
      });
    }

    // Hash new password with bcrypt
    const newHash = await bcrypt.hash(newPassword, ENV.BCRYPT_SALT_ROUNDS);
    user.passwordHash = newHash;
    user.mustChangePassword = false;
    user.temporaryPasswordExpiresAt = null;
    user.passwordChangedAt = new Date();
    user.tokenVersion = (user.tokenVersion || 1) + 1;
    await user.save();

    // Invalidate all previous sessions for this user in MongoDB
    await revokeAllUserSessions(user._id, 'password_change');

    // Record audit log for staff password changes
    if (role === 'teacher' || role === 'superadmin') {
      await recordAuditLog({
        req,
        actor: user,
        action: 'PASSWORD_CHANGE',
        targetType: role === 'superadmin' ? 'Superadmin' : 'Teacher',
        targetId: user._id,
        details: { username: user.username },
      });
    }

    // Create a new session for the current authenticated client
    const sessionId = await createSession({ user, req });
    const token = generateToken(user, sessionId);
    const safeUser = user.toSafeObject();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
      token,
      role: user.role || 'student',
      user: safeUser,
      student: user.role === 'student' ? safeUser : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Retrieve authenticated user session details
 */
export async function getMe(req, res, next) {
  try {
    const safeUser = req.user.toSafeObject();
    return res.status(200).json({
      success: true,
      role: req.user.role || 'student',
      user: safeUser,
      student: req.user.role === 'student' ? safeUser : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Revoke the current session in MongoDB and confirm termination
 */
export async function logout(req, res) {
  if (req.sessionId) {
    await revokeSession(req.sessionId, 'user_logout');
  }

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}
