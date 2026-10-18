import { verifyToken } from '../utils/token.js';
import { validateSession } from '../utils/sessionManager.js';
import { Student } from '../models/Student.js';
import { Staff } from '../models/Staff.js';

/**
 * Universal Authentication Middleware
 * Authenticates students, teachers, and superadmins.
 * Verifies JWT signature, active session state in MongoDB, account activity, and token version.
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid session token.',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }

    // 1. Session ID (sid) is strictly mandatory on all tokens for stateful session validation & revocation
    if (!decoded.sid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token: missing session identifier (sid). Please log in again.',
      });
    }

    const sessionCheck = await validateSession(decoded.sid);
    if (!sessionCheck.valid) {
      return res.status(401).json({
        success: false,
        message: sessionCheck.reason || 'Session has been revoked or expired. Please log in again.',
      });
    }

    let user = null;

    // Check staff first if token role indicates teacher/superadmin
    if (decoded.role === 'teacher' || decoded.role === 'superadmin') {
      user = await Staff.findById(decoded.sub);
    } else {
      user = await Student.findById(decoded.sub);
      if (!user) {
        user = await Staff.findById(decoded.sub);
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or removed.',
      });
    }

    // Check if account is deactivated
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Your account is currently inactive. Please contact institute administration.',
      });
    }

    // Check token version against user's current tokenVersion (revocation on password reset)
    if (
      decoded.tokenVersion !== undefined &&
      user.tokenVersion !== undefined &&
      decoded.tokenVersion < user.tokenVersion
    ) {
      return res.status(401).json({
        success: false,
        message: 'Session has been invalidated due to a security update. Please log in again.',
      });
    }

    // Attach user and session to request
    req.user = user;
    req.sessionId = decoded.sid || null;

    // Backward compatibility for existing student routes
    if (user.role === 'student') {
      req.student = user;
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Backward-compatible Student Authentication
 */
export async function authenticateStudent(req, res, next) {
  await authenticateUser(req, res, () => {
    if (req.user?.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: student account required.',
      });
    }
    next();
  });
}

/**
 * Role-Based Authorization Middleware
 * @param {string | string[]} allowedRoles
 */
export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: your account role does not have permission for this resource.',
      });
    }

    next();
  };
}

/**
 * Ensure account is active
 */
export function requireActiveAccount(req, res, next) {
  const user = req.user || req.student;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (user.isActive === false) {
    return res.status(403).json({
      success: false,
      message: 'Your account is currently inactive. Please contact institute administration.',
    });
  }

  next();
}

// Alias for student backward-compatibility
export const requireActiveStudent = requireActiveAccount;

/**
 * Ensure initial temporary password has been changed
 */
export function requirePasswordChangeComplete(req, res, next) {
  const user = req.user || req.student;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (user.mustChangePassword) {
    return res.status(403).json({
      success: false,
      code: 'PASSWORD_CHANGE_REQUIRED',
      message:
        'You are logged in with an initial temporary password. Please change your password to continue.',
    });
  }

  next();
}

/**
 * Ensure teacher is assigned to the specified batch.
 * Superadmin is granted full access across all batches.
 */
export function requireAssignedBatch(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  // Superadmin has universal batch access
  if (req.user.role === 'superadmin') {
    return next();
  }

  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: teacher role required.',
    });
  }

  // Extract requested batch code from params, body, or query
  const rawBatch =
    req.params.batchCode ||
    req.params.batchId ||
    req.body.batchCode ||
    req.body.batch ||
    req.query.batchCode ||
    req.query.batch ||
    '';

  const requestedBatch = rawBatch.trim().toUpperCase();

  if (!requestedBatch) {
    return res.status(400).json({
      success: false,
      message: 'Batch code is required for this operation.',
    });
  }

  // Check teacher's assigned batches
  const assigned = (req.user.assignedBatches || []).map((b) => b.toUpperCase());

  // Also check without "BATCH-" prefix for full compatibility (e.g. "2026" matches "BATCH-2026")
  const isAssigned =
    assigned.includes(requestedBatch) ||
    assigned.includes(`BATCH-${requestedBatch}`) ||
    assigned.map((b) => b.replace('BATCH-', '')).includes(requestedBatch.replace('BATCH-', ''));

  if (!isAssigned) {
    return res.status(403).json({
      success: false,
      message: `Access denied: you are not assigned to manage batch '${requestedBatch}'.`,
    });
  }

  next();
}
