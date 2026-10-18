import mongoose from 'mongoose';
import { LoginRateLimit } from '../models/LoginRateLimit.js';

/**
 * Distributed MongoDB-backed login rate limiter with proxy-safe IP detection
 * and bounded in-memory fallback.
 *
 * Prevents:
 * 1. Brute-force credential stuffing attacks (per-IP and per-account burst limits)
 * 2. Victim denial-of-service lockout (per-IP+username throttling isolates attackers)
 * 3. Distributed botnet credential attacks (per-username abuse tracking across IPs)
 * 4. Global volumetric denial-of-service (global attempts safety limiter)
 * 5. IP spoofing attacks (relies exclusively on Express req.ip derived from configured trust proxy)
 * 6. Memory exhaustion (bounded in-memory fallback and MongoDB TTL indexes)
 */

const MAX_FAILED_ATTEMPTS_PER_IP_USER = parseInt(process.env.LOGIN_MAX_ATTEMPTS_PER_IP_USER || '10', 10);
const MAX_FAILED_ATTEMPTS_PER_IP = parseInt(process.env.LOGIN_MAX_ATTEMPTS_PER_IP || '30', 10);
const MAX_FAILED_ATTEMPTS_PER_USER_GLOBAL = parseInt(process.env.LOGIN_MAX_ATTEMPTS_PER_USER_GLOBAL || '50', 10);
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
  const currentMinute = Math.floor(Date.now() / 60000);

  const keysToCheck = [`ip:${ip}`, `global:${currentMinute}`];
  if (cleanUsername) {
    keysToCheck.push(`ip_user:${ip}:${cleanUsername}`);
    keysToCheck.push(`user:${cleanUsername}`);
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
      const remainingSeconds = Math.max(
        1,
        Math.ceil((new Date(lockedRecord.lockedUntil).getTime() - now.getTime()) / 1000)
      );
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
 * Atomically record a failed login attempt for client IP, username, and global safety counters.
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
  const currentMinute = Math.floor(nowMs / 60000);

  const ipKey = `ip:${ip}`;
  const ipUserKey = cleanUsername ? `ip_user:${ip}:${cleanUsername}` : null;
  const userKey = cleanUsername ? `user:${cleanUsername}` : null;
  const globalKey = `global:${currentMinute}`;

  const expireAt = new Date(nowMs + WINDOW_DURATION_MS);
  const globalExpireAt = new Date(nowMs + 120000); // 2-minute TTL for minute buckets

  let lockedNow = false;
  let remainingAttempts = MAX_FAILED_ATTEMPTS_PER_IP_USER;

  // In-memory update helper
  const updateMemoryCounter = (key, maxAllowed, lockDuration = LOCKOUT_DURATION_MS) => {
    let rec = memoryFallbackStore.get(key);
    if (!rec || (nowMs - rec.lastAttempt > WINDOW_DURATION_MS && !rec.lockedUntil)) {
      rec = { count: 1, lockedUntil: null, lastAttempt: nowMs };
    } else {
      rec.count += 1;
      rec.lastAttempt = nowMs;
    }

    if (rec.count >= maxAllowed) {
      rec.lockedUntil = nowMs + lockDuration;
      rec.count = 0;
      lockedNow = true;
    }
    setMemoryRecord(key, rec);
    return rec;
  };

  // If MongoDB is not connected, use in-memory store immediately
  if (!isMongoConnected()) {
    if (ipUserKey) {
      const rec = updateMemoryCounter(ipUserKey, MAX_FAILED_ATTEMPTS_PER_IP_USER);
      if (!lockedNow) {
        remainingAttempts = Math.min(remainingAttempts, MAX_FAILED_ATTEMPTS_PER_IP_USER - rec.count);
      }
    }
    if (userKey) {
      updateMemoryCounter(userKey, MAX_FAILED_ATTEMPTS_PER_USER_GLOBAL);
    }
    updateMemoryCounter(ipKey, MAX_FAILED_ATTEMPTS_PER_IP);
    updateMemoryCounter(globalKey, MAX_GLOBAL_ATTEMPTS_PER_MINUTE, 60000);

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

    // 2. Atomically record attempt for global per-username protection across IPs
    if (userKey) {
      const userRecord = await LoginRateLimit.findOneAndUpdate(
        { key: userKey },
        {
          $inc: { attempts: 1 },
          $set: { lastAttempt: now, expireAt },
          $setOnInsert: { type: 'username', firstAttempt: now },
        },
        { upsert: true, new: true }
      );

      if (userRecord.attempts >= MAX_FAILED_ATTEMPTS_PER_USER_GLOBAL) {
        const lockExpiry = new Date(nowMs + LOCKOUT_DURATION_MS);
        await LoginRateLimit.updateOne(
          { key: userKey },
          {
            $set: {
              lockedUntil: lockExpiry,
              expireAt: new Date(Math.max(expireAt.getTime(), lockExpiry.getTime())),
            },
          }
        );
        lockedNow = true;
      }
    }

    // 3. Atomically record attempt for IP
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

    // 4. Atomically record global minute safety counter
    const globalRecord = await LoginRateLimit.findOneAndUpdate(
      { key: globalKey },
      {
        $inc: { attempts: 1 },
        $set: { lastAttempt: now, expireAt: globalExpireAt },
        $setOnInsert: { type: 'global', firstAttempt: now },
      },
      { upsert: true, new: true }
    );

    if (globalRecord.attempts >= MAX_GLOBAL_ATTEMPTS_PER_MINUTE) {
      const lockExpiry = new Date(nowMs + 60000);
      await LoginRateLimit.updateOne(
        { key: globalKey },
        {
          $set: {
            lockedUntil: lockExpiry,
            expireAt: new Date(Math.max(globalExpireAt.getTime(), lockExpiry.getTime())),
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
      const rec = updateMemoryCounter(ipUserKey, MAX_FAILED_ATTEMPTS_PER_IP_USER);
      if (!lockedNow) {
        remainingAttempts = Math.min(remainingAttempts, MAX_FAILED_ATTEMPTS_PER_IP_USER - rec.count);
      }
    }
    if (userKey) {
      updateMemoryCounter(userKey, MAX_FAILED_ATTEMPTS_PER_USER_GLOBAL);
    }
    updateMemoryCounter(ipKey, MAX_FAILED_ATTEMPTS_PER_IP);
    updateMemoryCounter(globalKey, MAX_GLOBAL_ATTEMPTS_PER_MINUTE, 60000);

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
    const userKey = `user:${cleanUsername}`;
    memoryFallbackStore.delete(ipUserKey);
    memoryFallbackStore.delete(userKey);
    if (isMongoConnected()) {
      try {
        await LoginRateLimit.deleteMany({ key: { $in: [ipUserKey, userKey] } });
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
