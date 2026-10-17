import mongoose from 'mongoose';
import { LoginRateLimit } from '../models/LoginRateLimit.js';

/**
 * Distributed MongoDB-backed login rate limiter with proxy-safe IP detection
 * and bounded in-memory fallback.
 *
 * Prevents:
 * 1. Brute-force credential stuffing attacks (per-IP and per-account burst limits)
 * 2. Victim denial-of-service lockout (per-IP+username throttling isolates attackers)
 * 3. IP spoofing attacks (relies exclusively on Express req.ip derived from configured trust proxy)
 * 4. Memory exhaustion (bounded in-memory fallback and MongoDB TTL indexes)
 */

const MAX_FAILED_ATTEMPTS_PER_IP_USER = parseInt(process.env.LOGIN_MAX_ATTEMPTS_PER_IP_USER || '10', 10);
const MAX_FAILED_ATTEMPTS_PER_IP = parseInt(process.env.LOGIN_MAX_ATTEMPTS_PER_IP || '30', 10);
const MAX_GLOBAL_ATTEMPTS_PER_MINUTE = parseInt(process.env.LOGIN_GLOBAL_RATE_LIMIT || '200', 10);
const LOCKOUT_DURATION_MS = parseInt(process.env.LOGIN_LOCKOUT_DURATION_MS || '60000', 10); // 60 seconds
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15-minute sliding window

// Bounded in-memory fallback store: max 1000 keys
const MAX_FALLBACK_ENTRIES = 1000;
const memoryFallbackStore = new Map();

function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

function cleanMemoryStore() {
  const now = Date.now();
  for (const [key, record] of memoryFallbackStore.entries()) {
    if (record.lockedUntil && record.lockedUntil <= now && now - record.lastAttempt > WINDOW_DURATION_MS) {
      memoryFallbackStore.delete(key);
    } else if (!record.lockedUntil && now - record.lastAttempt > WINDOW_DURATION_MS) {
      memoryFallbackStore.delete(key);
    }
  }
}

function setMemoryRecord(key, record) {
  if (memoryFallbackStore.size >= MAX_FALLBACK_ENTRIES) {
    cleanMemoryStore();
    if (memoryFallbackStore.size >= MAX_FALLBACK_ENTRIES) {
      // Evict oldest entry
      const oldestKey = memoryFallbackStore.keys().next().value;
      if (oldestKey) memoryFallbackStore.delete(oldestKey);
    }
  }
  memoryFallbackStore.set(key, record);
}

/**
 * Extract client IP securely from Express request.
 * NEVER trust raw X-Forwarded-For header directly.
 * Express req.ip is populated based on app.set('trust proxy', ...) configuration.
 */
export function getClientIp(req) {
  if (!req) return '127.0.0.1';
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Check if the given client IP or username is currently locked out.
 *
 * @param {import('express').Request} req
 * @param {string} [username='']
 * @returns {Promise<{ isLocked: boolean, remainingSeconds?: number }>}
 */
export async function checkLoginRateLimit(req, username = '') {
  const ip = getClientIp(req);
  const cleanUsername = String(username || '').trim().toLowerCase();

  const keysToCheck = [`ip:${ip}`];
  if (cleanUsername) {
    keysToCheck.push(`ip_user:${ip}:${cleanUsername}`);
  }

  // If MongoDB is not actively connected, use in-memory store immediately
  if (!isMongoConnected()) {
    const nowMs = Date.now();
    for (const key of keysToCheck) {
      const memRecord = memoryFallbackStore.get(key);
      if (memRecord && memRecord.lockedUntil && memRecord.lockedUntil > nowMs) {
        const remainingSeconds = Math.max(1, Math.ceil((memRecord.lockedUntil - nowMs) / 1000));
        return { isLocked: true, remainingSeconds };
      }
    }
    return { isLocked: false };
  }

  // 1. Try MongoDB check
  try {
    const now = new Date();
    const lockedRecord = await LoginRateLimit.findOne({
      key: { $in: keysToCheck },
      lockedUntil: { $gt: now },
    }).lean();

    if (lockedRecord && lockedRecord.lockedUntil) {
      const remainingSeconds = Math.max(1, Math.ceil((new Date(lockedRecord.lockedUntil).getTime() - now.getTime()) / 1000));
      return { isLocked: true, remainingSeconds };
    }

    return { isLocked: false };
  } catch (err) {
    // MongoDB unavailable: fall back safely to in-memory store
    console.warn('[RATE LIMITER] MongoDB query error, using fallback:', err.message);
    const nowMs = Date.now();
    for (const key of keysToCheck) {
      const memRecord = memoryFallbackStore.get(key);
      if (memRecord && memRecord.lockedUntil && memRecord.lockedUntil > nowMs) {
        const remainingSeconds = Math.max(1, Math.ceil((memRecord.lockedUntil - nowMs) / 1000));
        return { isLocked: true, remainingSeconds };
      }
    }
    return { isLocked: false };
  }
}

/**
 * Atomically record a failed login attempt for the client IP and username.
 *
 * @param {import('express').Request} req
 * @param {string} [username='']
 * @returns {Promise<{ lockedNow: boolean, remainingSeconds?: number, attemptsRemaining: number }>}
 */
export async function recordFailedLogin(req, username = '') {
  const ip = getClientIp(req);
  const now = new Date();
  const nowMs = now.getTime();
  const cleanUsername = String(username || '').trim().toLowerCase();

  const ipKey = `ip:${ip}`;
  const ipUserKey = cleanUsername ? `ip_user:${ip}:${cleanUsername}` : null;
  const expireAt = new Date(nowMs + WINDOW_DURATION_MS);

  let lockedNow = false;
  let remainingAttempts = MAX_FAILED_ATTEMPTS_PER_IP_USER;

  // If MongoDB is not connected, use in-memory store immediately
  if (!isMongoConnected()) {
    if (ipUserKey) {
      let record = memoryFallbackStore.get(ipUserKey);
      if (!record || (nowMs - record.lastAttempt > WINDOW_DURATION_MS && !record.lockedUntil)) {
        record = { count: 1, lockedUntil: null, lastAttempt: nowMs };
      } else {
        record.count += 1;
        record.lastAttempt = nowMs;
      }

      if (record.count >= MAX_FAILED_ATTEMPTS_PER_IP_USER) {
        record.lockedUntil = nowMs + LOCKOUT_DURATION_MS;
        record.count = 0;
        lockedNow = true;
      } else {
        remainingAttempts = Math.min(remainingAttempts, MAX_FAILED_ATTEMPTS_PER_IP_USER - record.count);
      }
      setMemoryRecord(ipUserKey, record);
    }

    let ipRecord = memoryFallbackStore.get(ipKey);
    if (!ipRecord || (nowMs - ipRecord.lastAttempt > WINDOW_DURATION_MS && !ipRecord.lockedUntil)) {
      ipRecord = { count: 1, lockedUntil: null, lastAttempt: nowMs };
    } else {
      ipRecord.count += 1;
      ipRecord.lastAttempt = nowMs;
    }
    if (ipRecord.count >= MAX_FAILED_ATTEMPTS_PER_IP) {
      ipRecord.lockedUntil = nowMs + LOCKOUT_DURATION_MS;
      ipRecord.count = 0;
      lockedNow = true;
    }
    setMemoryRecord(ipKey, ipRecord);

    if (lockedNow) {
      return {
        lockedNow: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attemptsRemaining: 0,
      };
    }

    return {
      lockedNow: false,
      attemptsRemaining: Math.max(1, remainingAttempts),
    };
  }

  try {
    // 1. Atomically record attempt for ip_user pair
    if (ipUserKey) {
      const record = await LoginRateLimit.findOneAndUpdate(
        { key: ipUserKey },
        {
          $inc: { attempts: 1 },
          $set: { lastAttempt: now, expireAt },
          $setOnInsert: { type: 'ip_user', firstAttempt: now },
        },
        { upsert: true, new: true }
      );

      if (record.attempts >= MAX_FAILED_ATTEMPTS_PER_IP_USER) {
        const lockExpiry = new Date(nowMs + LOCKOUT_DURATION_MS);
        await LoginRateLimit.updateOne(
          { key: ipUserKey },
          {
            $set: {
              lockedUntil: lockExpiry,
              expireAt: new Date(Math.max(expireAt.getTime(), lockExpiry.getTime())),
            },
          }
        );
        lockedNow = true;
      } else {
        remainingAttempts = Math.min(
          remainingAttempts,
          MAX_FAILED_ATTEMPTS_PER_IP_USER - record.attempts
        );
      }
    }

    // 2. Atomically record attempt for IP
    const ipRecord = await LoginRateLimit.findOneAndUpdate(
      { key: ipKey },
      {
        $inc: { attempts: 1 },
        $set: { lastAttempt: now, expireAt },
        $setOnInsert: { type: 'ip', firstAttempt: now },
      },
      { upsert: true, new: true }
    );

    if (ipRecord.attempts >= MAX_FAILED_ATTEMPTS_PER_IP) {
      const lockExpiry = new Date(nowMs + LOCKOUT_DURATION_MS);
      await LoginRateLimit.updateOne(
        { key: ipKey },
        {
          $set: {
            lockedUntil: lockExpiry,
            expireAt: new Date(Math.max(expireAt.getTime(), lockExpiry.getTime())),
          },
        }
      );
      lockedNow = true;
    }

    if (lockedNow) {
      return {
        lockedNow: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attemptsRemaining: 0,
      };
    }

    return {
      lockedNow: false,
      attemptsRemaining: Math.max(1, remainingAttempts),
    };
  } catch (err) {
    // MongoDB error: fall back safely to in-memory tracking
    console.warn('[RATE LIMITER] MongoDB error during recordFailedLogin, using fallback:', err.message);

    if (ipUserKey) {
      let record = memoryFallbackStore.get(ipUserKey);
      if (!record || (nowMs - record.lastAttempt > WINDOW_DURATION_MS && !record.lockedUntil)) {
        record = { count: 1, lockedUntil: null, lastAttempt: nowMs };
      } else {
        record.count += 1;
        record.lastAttempt = nowMs;
      }

      if (record.count >= MAX_FAILED_ATTEMPTS_PER_IP_USER) {
        record.lockedUntil = nowMs + LOCKOUT_DURATION_MS;
        record.count = 0;
        lockedNow = true;
      } else {
        remainingAttempts = Math.min(remainingAttempts, MAX_FAILED_ATTEMPTS_PER_IP_USER - record.count);
      }
      setMemoryRecord(ipUserKey, record);
    }

    let ipRecord = memoryFallbackStore.get(ipKey);
    if (!ipRecord || (nowMs - ipRecord.lastAttempt > WINDOW_DURATION_MS && !ipRecord.lockedUntil)) {
      ipRecord = { count: 1, lockedUntil: null, lastAttempt: nowMs };
    } else {
      ipRecord.count += 1;
      ipRecord.lastAttempt = nowMs;
    }
    if (ipRecord.count >= MAX_FAILED_ATTEMPTS_PER_IP) {
      ipRecord.lockedUntil = nowMs + LOCKOUT_DURATION_MS;
      ipRecord.count = 0;
      lockedNow = true;
    }
    setMemoryRecord(ipKey, ipRecord);

    if (lockedNow) {
      return {
        lockedNow: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attemptsRemaining: 0,
      };
    }

    return {
      lockedNow: false,
      attemptsRemaining: Math.max(1, remainingAttempts),
    };
  }
}

/**
 * Reset failed attempts on successful login for the specific client IP + username.
 *
 * @param {import('express').Request} req
 * @param {string} [username='']
 */
export async function recordSuccessfulLogin(req, username = '') {
  const ip = getClientIp(req);
  const cleanUsername = String(username || '').trim().toLowerCase();

  if (cleanUsername) {
    const ipUserKey = `ip_user:${ip}:${cleanUsername}`;
    memoryFallbackStore.delete(ipUserKey);
    if (isMongoConnected()) {
      try {
        await LoginRateLimit.deleteOne({ key: ipUserKey });
      } catch {
        // Ignore background cleanup errors
      }
    }
  }
}

/**
 * Clear all rate limits (for testing or administrative reset)
 */
export async function resetAllRateLimits() {
  memoryFallbackStore.clear();
  if (isMongoConnected()) {
    try {
      await LoginRateLimit.deleteMany({});
    } catch {
      // Ignore error
    }
  }
}
