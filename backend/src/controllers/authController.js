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

/**
 * POST /api/auth/login
 * Unified authentication for students, teachers, and superadmins
 */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const cleanUsername = String(username || '').trim().toLowerCase();

    // 0. Check Rate Limit (Lockout for 60 seconds after 10 failed attempts)
    const rateCheck = checkLoginRateLimit(req, cleanUsername);
    if (rateCheck.isLocked) {
      return res.status(429).json({
        success: false,
        message: `Too many failed login attempts (10 failed attempts). Your access is restricted for ${rateCheck.remainingSeconds} second${rateCheck.remainingSeconds === 1 ? '' : 's'}. Please wait or contact your teachers or institute administrator for assistance.`,
        retryAfter: rateCheck.remainingSeconds,
      });
    }

    // 1. Search Staff (teachers & superadmins) first
    let user = await Staff.findOne({ username: cleanUsername }).select('+passwordHash');

    // 2. If not found in Staff, search Student
    if (!user) {
      user = await Student.findOne({ username: cleanUsername }).select('+passwordHash');
    }

    if (!user) {
      const failResult = recordFailedLogin(req, cleanUsername);
      if (failResult.lockedNow) {
        return res.status(429).json({
          success: false,
          message:
            'Too many failed login attempts (10 failed attempts). Your login access has been restricted for 60 seconds. Please wait or contact your teachers or institute administrator for assistance.',
          retryAfter: 60,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid username or password. (${failResult.attemptsRemaining} attempt${failResult.attemptsRemaining === 1 ? '' : 's'} remaining before a 60-second restriction. If you forgot your credentials, please contact your teachers or institute administrator.)`,
      });
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const failResult = recordFailedLogin(req, cleanUsername);
      if (failResult.lockedNow) {
        return res.status(429).json({
          success: false,
          message:
            'Too many failed login attempts (10 failed attempts). Your login access has been restricted for 60 seconds. Please wait or contact your teachers or institute administrator for assistance.',
          retryAfter: 60,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid username or password. (${failResult.attemptsRemaining} attempt${failResult.attemptsRemaining === 1 ? '' : 's'} remaining before a 60-second restriction. If you forgot your credentials, please contact your teachers or institute administrator.)`,
      });
    }

    // Login successful: reset rate limit attempts for this client/username
    recordSuccessfulLogin(req, cleanUsername);

    // Check account active state
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact institute administration.',
      });
    }

    // Check if temporary password has expired (valid 1 hour)
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

    // Generate JWT token
    const token = generateToken(user);
    const safeUser = user.toSafeObject();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      role: user.role || 'student',
      user: safeUser,
      // Backward compatibility for existing student portal client
      student: user.role === 'student' ? safeUser : undefined,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/change-password
 * Change password for authenticated student, teacher, or superadmin
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
    await user.save();

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

    // Issue refreshed token reflecting mustChangePassword: false
    const token = generateToken(user);
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
 * Client-side session termination confirmation
 */
export async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}
