import crypto from 'crypto';
import mongoose from 'mongoose';
import { Session } from '../models/Session.js';

/**
 * MongoDB-backed Session Manager (Redis-free distributed session management)
 * Tracks user sessions, handles token binding, and enforces immediate revocation.
 */

const DEFAULT_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Create a new active session record in MongoDB.
 *
 * @param {object} params
 * @param {object} params.user - User document (Staff or Student)
 * @param {import('express').Request} [params.req] - Express request object for IP & UA
 * @param {number} [params.ttlSeconds] - Session lifetime in seconds
 * @returns {Promise<string>} sessionId
 */
export async function createSession({ user, req = null, ttlSeconds = DEFAULT_SESSION_TTL_SECONDS }) {
  const sessionId = crypto.randomUUID();
  const userModel = user.role === 'student' ? 'Student' : 'Staff';
  const role = user.role || 'student';
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  const ipAddress = req ? (req.ip || req.socket?.remoteAddress || '') : '';
  const userAgent = req?.headers?.['user-agent'] || '';

  if (!isMongoConnected()) {
    return sessionId;
  }

  try {
    await Session.create({
      sessionId,
      userId: user._id,
      userModel,
      role,
      username: user.username,
      tokenVersion: user.tokenVersion || 1,
      ipAddress,
      userAgent: String(userAgent).slice(0, 500),
      isRevoked: false,
      expiresAt,
    });
  } catch (err) {
    console.error('[SESSION MANAGER] Error creating session record in MongoDB:', err.message);
  }

  return sessionId;
}

/**
 * Validate an active session against MongoDB.
 *
 * @param {string} sessionId
 * @param {object} [user] - Attached user object for tokenVersion & active check
 * @returns {Promise<{ valid: boolean, reason?: string, session?: object }>}
 */
export async function validateSession(sessionId, user = null) {
  if (!sessionId) {
    return { valid: false, reason: 'Session ID is missing.' };
  }

  if (!isMongoConnected()) {
    return { valid: true };
  }

  try {
    const session = await Session.findOne({ sessionId, isRevoked: false });
    if (!session) {
      return { valid: false, reason: 'Session has been revoked or expired.' };
    }

    if (new Date() > new Date(session.expiresAt)) {
      return { valid: false, reason: 'Session has expired.' };
    }

    // Check tokenVersion match if user is supplied
    if (user && user.tokenVersion !== undefined && session.tokenVersion !== undefined) {
      if (session.tokenVersion < user.tokenVersion) {
        return { valid: false, reason: 'Session invalidated due to password change or account update.' };
      }
    }

    // Check user active status
    if (user && user.isActive === false) {
      return { valid: false, reason: 'Account has been deactivated.' };
    }

    return { valid: true, session };
  } catch (err) {
    console.error('[SESSION MANAGER] Error validating session in MongoDB:', err.message);
    return { valid: false, reason: 'Unable to verify session validity.' };
  }
}

/**
 * Revoke a single active session (e.g. on user logout).
 *
 * @param {string} sessionId
 * @param {string} [reason='user_logout']
 * @returns {Promise<boolean>}
 */
export async function revokeSession(sessionId, reason = 'user_logout') {
  if (!sessionId) return false;

  if (!isMongoConnected()) {
    return true;
  }

  try {
    const result = await Session.updateOne(
      { sessionId, isRevoked: false },
      {
        $set: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: reason,
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (err) {
    console.error('[SESSION MANAGER] Error revoking session:', err.message);
    return false;
  }
}

/**
 * Bulk-revoke all active sessions for a specific user
 * (e.g. on password change, password reset, or account deactivation).
 *
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @param {string} [reason='password_changed']
 * @returns {Promise<number>} Number of revoked sessions
 */
export async function revokeAllUserSessions(userId, reason = 'password_changed') {
  if (!userId) return 0;

  if (!isMongoConnected()) {
    return 0;
  }

  try {
    const result = await Session.updateMany(
      { userId, isRevoked: false },
      {
        $set: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: reason,
        },
      }
    );
    return result.modifiedCount || 0;
  } catch (err) {
    console.error('[SESSION MANAGER] Error bulk-revoking user sessions:', err.message);
    return 0;
  }
}
