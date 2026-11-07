import { createClient } from 'redis';
import { RedisStore } from 'rate-limit-redis';
import { MemoryStore } from 'express-rate-limit';
import { ENV } from './env.js';

let redisClient = null;
let redisConnected = false;

/**
 * Connect to Redis instance if REDIS_URL is configured.
 * Non-fatal: if Redis is unavailable or fails, gracefully falls back to MongoDB / in-memory.
 */
export async function connectRedis() {
  if (!ENV.REDIS_URL) {
    console.warn('[REDIS] REDIS_URL not set — caching and sessions will fall back to MongoDB / memory');
    return null;
  }

  try {
    redisClient = createClient({
      url: ENV.REDIS_URL,
      socket: {
        family: 4,
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
        connectTimeout: 8000,
      },
    });

    redisClient.on('error', (err) => {
      redisConnected = false;
      console.warn('[REDIS] Connection error:', err.message);
    });

    redisClient.on('connect', () => {
      redisConnected = true;
      console.log('[REDIS] Connected successfully to Redis cluster');
    });

    redisClient.on('ready', () => {
      redisConnected = true;
    });

    redisClient.on('reconnecting', () => {
      redisConnected = false;
    });

    redisClient.on('end', () => {
      redisConnected = false;
    });

    await redisClient.connect();
    redisConnected = true;
    return redisClient;
  } catch (err) {
    console.warn('[REDIS WARNING] Could not connect to Redis on startup:', err.message);
    redisConnected = false;
    return null;
  }
}

/**
 * Get active Redis client instance
 */
export function getRedis() {
  return redisClient;
}

/**
 * Check if Redis is actively connected and ready for commands
 */
export function isRedisConnected() {
  return redisConnected && redisClient !== null && redisClient.isOpen;
}

/**
 * Gracefully close Redis connection
 */
export async function disconnectRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch {
      try {
        redisClient.disconnect();
      } catch {
        // ignore disconnect errors during shutdown
      }
    } finally {
      redisClient = null;
      redisConnected = false;
    }
  }
}

/* ========================================================================== */
/* CACHE INVALIDATION HELPERS                                                 */
/* ========================================================================== */

/**
 * Invalidate superadmin dashboard aggregated cache
 */
export async function invalidateDashboardCache() {
  if (!isRedisConnected()) return;
  try {
    await redisClient.del('cache:dashboard');
  } catch (err) {
    console.warn('[REDIS CACHE] Error invalidating dashboard cache:', err.message);
  }
}

/**
 * Invalidate batch list and counts cache
 */
export async function invalidateBatchesCache() {
  if (!isRedisConnected()) return;
  try {
    await redisClient.del('cache:batches');
    for await (const chunk of redisClient.scanIterator({ MATCH: 'cache:batches:*', COUNT: 100 })) {
      const keys = Array.isArray(chunk) ? chunk : [chunk];
      if (keys.length > 0) await redisClient.del(keys);
    }
  } catch (err) {
    console.warn('[REDIS CACHE] Error invalidating batches cache:', err.message);
  }
}

/**
 * Invalidate paginated lecture caches for a given batch code or all batches
 * @param {string} [batchCode]
 */
export async function invalidateLectureCache(batchCode = '') {
  if (!isRedisConnected()) return;
  try {
    const pattern = batchCode
      ? `cache:lectures:${batchCode.toUpperCase()}*`
      : 'cache:lectures:*';
    for await (const chunk of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      const keys = Array.isArray(chunk) ? chunk : [chunk];
      if (keys.length > 0) await redisClient.del(keys);
    }
  } catch (err) {
    console.warn('[REDIS CACHE] Error invalidating lecture cache:', err.message);
  }
}

/**
 * Invalidate distinct subject caches for a given batch code or all batches
 * @param {string} [batchCode]
 */
export async function invalidateBatchSubjectsCache(batchCode = '') {
  if (!isRedisConnected()) return;
  try {
    const pattern = batchCode
      ? `cache:subjects:${batchCode.toUpperCase()}*`
      : 'cache:subjects:*';
    for await (const chunk of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      const keys = Array.isArray(chunk) ? chunk : [chunk];
      if (keys.length > 0) await redisClient.del(keys);
    }
  } catch (err) {
    console.warn('[REDIS CACHE] Error invalidating subjects cache:', err.message);
  }
}

/**
 * Creates an adaptive rate-limit store that leverages RedisStore when connected,
 * seamlessly falling back to in-memory store if Redis is unavailable or disconnected.
 *
 * @param {string} [prefix='rl_express:']
 */
export function createAdaptiveRateLimitStore(prefix = 'rl_express:') {
  const memStore = new MemoryStore();
  let redisStore = null;
  let initOptions = null;

  return {
    init(options) {
      initOptions = options;
      memStore.init(options);
    },
    getStore() {
      if (isRedisConnected()) {
        if (!redisStore) {
          try {
            redisStore = new RedisStore({
              sendCommand: (...args) => getRedis().sendCommand(args),
              prefix,
            });
            if (redisStore.init && initOptions) {
              redisStore.init(initOptions);
            }
          } catch (err) {
            console.warn('[RATE LIMIT STORE] Failed to initialize RedisStore, falling back:', err.message);
            return memStore;
          }
        }
        return redisStore;
      }
      return memStore;
    },
    async increment(key) {
      return this.getStore().increment(key);
    },
    async decrement(key) {
      return this.getStore().decrement(key);
    },
    async resetKey(key) {
      return this.getStore().resetKey(key);
    },
    async resetAll() {
      return this.getStore().resetAll();
    },
  };
}
