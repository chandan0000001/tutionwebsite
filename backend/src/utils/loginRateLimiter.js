/**
 * In-memory login attempt rate limiter.
 * Enforces a 60-second restriction after 10 consecutive failed login attempts.
 * Advises users to contact their teachers or institute administration for assistance.
 */

const MAX_FAILED_ATTEMPTS_PER_USER = 10;
const MAX_FAILED_ATTEMPTS_PER_IP = 30;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15-minute sliding window

// Map of key -> { count: number, lockedUntil: number | null, lastAttempt: number }
const attemptsStore = new Map();

/**
 * Extract client IP from Express request
 */
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
}

/**
 * Check if the given client or username is currently rate-limited (locked out).
 * Returns { isLocked: boolean, remainingSeconds?: number }
 */
export function checkLoginRateLimit(req, username = '') {
  const ip = getClientIp(req);
  const now = Date.now();
  const cleanUsername = String(username).trim().toLowerCase();

  const userKey = cleanUsername ? `user:${cleanUsername}` : null;
  const ipKey = `ip:${ip}`;

  // Check specific user lockout first
  if (userKey) {
    const userRecord = attemptsStore.get(userKey);
    if (userRecord?.lockedUntil && userRecord.lockedUntil > now) {
      const remainingSeconds = Math.ceil((userRecord.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
  }

  // Check IP-wide lockout
  const ipRecord = attemptsStore.get(ipKey);
  if (ipRecord?.lockedUntil && ipRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((ipRecord.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  return { isLocked: false };
}

/**
 * Record a failed login attempt for the username and client IP.
 * If 10 failures are reached for a user, activates a 60-second lockout.
 * Returns { lockedNow: boolean, remainingSeconds?: number, attemptsRemaining: number }
 */
export function recordFailedLogin(req, username = '') {
  const ip = getClientIp(req);
  const now = Date.now();
  const cleanUsername = String(username).trim().toLowerCase();

  let lockedNow = false;
  let remainingAttempts = MAX_FAILED_ATTEMPTS_PER_USER;

  // 1. Record for Username (limit: 10)
  if (cleanUsername) {
    const userKey = `user:${cleanUsername}`;
    let record = attemptsStore.get(userKey);

    if (!record || (now - record.lastAttempt > WINDOW_DURATION_MS && !record.lockedUntil)) {
      record = { count: 1, lockedUntil: null, lastAttempt: now };
    } else {
      record.count += 1;
      record.lastAttempt = now;
    }

    if (record.count >= MAX_FAILED_ATTEMPTS_PER_USER) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
      record.count = 0; // reset for next cycle after lockout
      lockedNow = true;
    } else {
      remainingAttempts = Math.min(remainingAttempts, MAX_FAILED_ATTEMPTS_PER_USER - record.count);
    }

    attemptsStore.set(userKey, record);
  }

  // 2. Record for IP (limit: 30)
  const ipKey = `ip:${ip}`;
  let ipRecord = attemptsStore.get(ipKey);
  if (!ipRecord || (now - ipRecord.lastAttempt > WINDOW_DURATION_MS && !ipRecord.lockedUntil)) {
    ipRecord = { count: 1, lockedUntil: null, lastAttempt: now };
  } else {
    ipRecord.count += 1;
    ipRecord.lastAttempt = now;
  }
  if (ipRecord.count >= MAX_FAILED_ATTEMPTS_PER_IP) {
    ipRecord.lockedUntil = now + LOCKOUT_DURATION_MS;
    ipRecord.count = 0;
    lockedNow = true;
  }
  attemptsStore.set(ipKey, ipRecord);

  if (lockedNow) {
    return {
      lockedNow: true,
      remainingSeconds: 60,
      attemptsRemaining: 0,
    };
  }

  return {
    lockedNow: false,
    attemptsRemaining: Math.max(1, remainingAttempts),
  };
}

/**
 * Reset failed attempts on successful login
 */
export function recordSuccessfulLogin(req, username = '') {
  const cleanUsername = String(username).trim().toLowerCase();
  if (cleanUsername) {
    attemptsStore.delete(`user:${cleanUsername}`);
  }
  const ip = getClientIp(req);
  if (ip) {
    attemptsStore.delete(`ip:${ip}`);
  }
}

/**
 * Clear all rate limits (for testing or administrative reset)
 */
export function resetAllRateLimits() {
  attemptsStore.clear();
}

// Periodically clean up stale records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attemptsStore.entries()) {
    if (record.lockedUntil && record.lockedUntil <= now && now - record.lastAttempt > WINDOW_DURATION_MS) {
      attemptsStore.delete(key);
    } else if (!record.lockedUntil && now - record.lastAttempt > WINDOW_DURATION_MS) {
      attemptsStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();
