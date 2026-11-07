import crypto from 'crypto';
import mongoose from 'mongoose';
import { Session } from '../models/Session.js';
import { getRedis, isRedisConnected } from '../config/redis.js';

/**
 * High-performance Distributed Session Manager
 * Backed by Redis fast-path with MongoDB fallback & audit persistence.
 * Tracks user sessions, handles token binding, and enforces immediate revocation.
 */

const DEFAULT_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const SESSION_PREFIX = 'session:';
const USER_SET_PREFIX = 'user_sessions:';

function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Create a new active session record in Redis (primary) and MongoDB (fallback/audit).
 *
 * @param {object} params
 * @param {object} params.user - User document (Staff or Student)
 * @param {import('express').Request} [params.req] - Express request object for IP & UA
 * @param {number} [params.ttlSeconds] - Session lifetime in seconds
 * @returns {Promise<string>} sessionId
 */
export async function createSession({ user, req = null, ttlSeconds = DEFAULT_SESSION_TTL_SECONDS }) {
  const sessionId = crypto.randomUUID();
  const userId = user._id ? user._id.toString() : String(user.id || '');
  const userModel = user.role === 'student' ? 'Student' : 'Staff';
  const role = user.role || 'student';
  const expiresAtMs = Date.now() + ttlSeconds * 1000;
  const expiresAt = new Date(expiresAtMs);

  const ipAddress = req ? (req.ip || req.socket?.remoteAddress || '') : '';
  const userAgent = req?.headers?.['user-agent'] || '';

  // 1. Redis fast path
  if (isRedisConnected()) {
    try {
      const redis = getRedis();
      const pipeline = redis.multi();
      pipeline.hSet(`${SESSION_PREFIX}${sessionId}`, {
        userId,
        userModel,
        role,
        username: user.username || '',
        tokenVersion: String(user.tokenVersion || 1),
        expiresAt: String(expiresAtMs),
        ipAddress: String(ipAddress),
        userAgent: String(userAgent).slice(0, 500),
      });
      pipeline.expire(`${SESSION_PREFIX}${sessionId}`, ttlSeconds);
      if (userId) {
        pipeline.sAdd(`${USER_SET_PREFIX}${userId}`, sessionId);
        pipeline.expire(`${USER_SET_PREFIX}${userId}`, ttlSeconds + 86400);
      }
      await pipeline.exec();
    } catch (redisErr) {
      console.warn('[SESSION MANAGER] Redis session creation failed, continuing to MongoDB:', redisErr.message);
    }
  }

  // 2. MongoDB persistence / fallback
  if (isMongoConnected()) {
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
  }

  return sessionId;
}

/**
 * Validate an active session against Redis (fast path) or MongoDB (fallback).
 *
 * @param {string} sessionId
 * @param {object} [user] - Attached user object for tokenVersion & active check
 * @returns {Promise<{ valid: boolean, reason?: string, session?: object }>}
 */
export async function validateSession(sessionId, user = null) {
  if (!sessionId) {
    return { valid: false, reason: 'Session ID is missing.' };
  }

  // 1. Redis fast path: O(1) HGETALL
  if (isRedisConnected()) {
    try {
      const redis = getRedis();
      const data = await redis.hGetAll(`${SESSION_PREFIX}${sessionId}`);

      if (data && data.userId) {
        if (Date.now() > parseInt(data.expiresAt, 10)) {
          return { valid: false, reason: 'Session has expired.' };
        }

        if (user && user.tokenVersion !== undefined) {
          const sessionTokenVer = parseInt(data.tokenVersion || '1', 10);
          if (sessionTokenVer < user.tokenVersion) {
            return { valid: false, reason: 'Session invalidated due to password change or account update.' };
          }
        }

        if (user && user.isActive === false) {
          return { valid: false, reason: 'Account has been deactivated.' };
        }

        return { valid: true, session: data };
      }

      // If session is absent in Redis:
      // If MongoDB is connected, check for legacy session in MongoDB
      if (isMongoConnected()) {
        const session = await Session.findOne({ sessionId, isRevoked: false });
        if (!session) {
          return { valid: false, reason: 'Session has been revoked or expired.' };
        }

        if (new Date() > new Date(session.expiresAt)) {
          return { valid: false, reason: 'Session has expired.' };
        }

        if (user && user.tokenVersion !== undefined && session.tokenVersion !== undefined) {
          if (session.tokenVersion < user.tokenVersion) {
            return { valid: false, reason: 'Session invalidated due to password change or account update.' };
          }
        }

        if (user && user.isActive === false) {
          return { valid: false, reason: 'Account has been deactivated.' };
        }

        // Backfill Redis cache
        const remainingSeconds = Math.max(
          1,
          Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
        );
        const pipeline = redis.multi();
        pipeline.hSet(`${SESSION_PREFIX}${sessionId}`, {
          userId: session.userId ? session.userId.toString() : '',
          userModel: session.userModel || 'Staff',
          role: session.role || 'student',
          username: session.username || '',
          tokenVersion: String(session.tokenVersion || 1),
          expiresAt: String(new Date(session.expiresAt).getTime()),
          ipAddress: session.ipAddress || '',
          userAgent: session.userAgent || '',
        });
        pipeline.expire(`${SESSION_PREFIX}${sessionId}`, remainingSeconds);
        if (session.userId) {
          pipeline.sAdd(`${USER_SET_PREFIX}${session.userId.toString()}`, sessionId);
        }
        await pipeline.exec();

        return { valid: true, session };
      }

      // Redis is connected but MongoDB is not, and session was not found in Redis
      return { valid: false, reason: 'Session has been revoked or expired.' };
    } catch (redisErr) {
      console.warn('[SESSION MANAGER] Redis validateSession error, falling back to MongoDB:', redisErr.message);
    }
  }

  // 2. MongoDB fallback (when Redis is unavailable)
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

  let redisRevoked = false;

  // 1. Redis instant invalidation
  if (isRedisConnected()) {
    try {
      const redis = getRedis();
      const sessionData = await redis.hGetAll(`${SESSION_PREFIX}${sessionId}`);
      const deleted = await redis.del(`${SESSION_PREFIX}${sessionId}`);
      if (sessionData && sessionData.userId) {
        await redis.sRem(`${USER_SET_PREFIX}${sessionData.userId}`, sessionId);
      }
      redisRevoked = deleted > 0;
    } catch (redisErr) {
      console.warn('[SESSION MANAGER] Redis revokeSession error:', redisErr.message);
    }
  }

  // 2. MongoDB update
  if (!isMongoConnected()) {
    return redisRevoked || true;
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
    return redisRevoked || result.modifiedCount > 0;
  } catch (err) {
    console.error('[SESSION MANAGER] Error revoking session in MongoDB:', err.message);
    return redisRevoked;
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
  const uidStr = userId.toString();
  let redisRevokedCount = 0;

  // 1. Redis bulk invalidation
  if (isRedisConnected()) {
    try {
      const redis = getRedis();
      const setKey = `${USER_SET_PREFIX}${uidStr}`;
      const sessionIds = await redis.sMembers(setKey);

      if (sessionIds && sessionIds.length > 0) {
        const pipeline = redis.multi();
        sessionIds.forEach((sid) => pipeline.del(`${SESSION_PREFIX}${sid}`));
        pipeline.del(setKey);
        await pipeline.exec();
        redisRevokedCount = sessionIds.length;
      }
    } catch (redisErr) {
      console.warn('[SESSION MANAGER] Redis revokeAllUserSessions error:', redisErr.message);
    }
  }

  // 2. MongoDB update
  if (!isMongoConnected()) {
    return redisRevokedCount;
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
    return Math.max(redisRevokedCount, result.modifiedCount || 0);
  } catch (err) {
    console.error('[SESSION MANAGER] Error bulk-revoking user sessions in MongoDB:', err.message);
    return redisRevokedCount;
  }
}
