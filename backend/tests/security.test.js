import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { getClientIp, checkLoginRateLimit, recordFailedLogin, recordSuccessfulLogin, resetAllRateLimits } from '../src/utils/loginRateLimiter.js';
import { validateYouTubeUrl, extractYouTubeId, getYouTubeEmbedUrl } from '../src/utils/youtube.js';
import { escapeRegex, createSafeSearchRegex, sanitizePhoneSearch } from '../src/utils/sanitizeSearch.js';
import { generateToken, verifyToken } from '../src/utils/token.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { requirePasswordChangeComplete, authenticateUser, requireAssignedBatch } from '../src/middleware/authMiddleware.js';
import { ENV } from '../src/config/env.js';

describe('1. Proxy-Aware Rate Limiting & Spoof Resistance', () => {
  beforeEach(async () => {
    await resetAllRateLimits();
  });

  test('getClientIp relies exclusively on req.ip populated by Express trust proxy, ignoring raw spoofed X-Forwarded-For', () => {
    const spoofedReq = {
      ip: '203.0.113.195', // Real client IP computed by Express
      headers: {
        'x-forwarded-for': '198.51.100.1, 10.0.0.1', // Attacker trying to spoof IP
      },
    };
    const resolvedIp = getClientIp(spoofedReq);
    assert.equal(resolvedIp, '203.0.113.195');
  });

  test('Attacker on IP-1 does not lock out legitimate user logging in from IP-2 (Victim DoS Resistance)', async () => {
    const attackerReq = { ip: '198.51.100.55', socket: {} };
    const legitimateReq = { ip: '203.0.113.88', socket: {} };
    const victimUsername = 'swati.biswal';

    // Attacker submits 10 failed login attempts from IP-1
    for (let i = 0; i < 10; i++) {
      await recordFailedLogin(attackerReq, victimUsername);
    }

    // Attacker on IP-1 is now rate-limited
    const attackerCheck = await checkLoginRateLimit(attackerReq, victimUsername);
    assert.equal(attackerCheck.isLocked, true);

    // Legitimate user from IP-2 is NOT locked out
    const legitCheck = await checkLoginRateLimit(legitimateReq, victimUsername);
    assert.equal(legitCheck.isLocked, false);
  });

  test('Multiple legitimate users behind shared NAT IP have independent per-account tracking', async () => {
    const sharedNatReq = { ip: '115.240.10.5', socket: {} };

    // User A fails 3 times
    for (let i = 0; i < 3; i++) {
      await recordFailedLogin(sharedNatReq, 'student.one');
    }

    // User B fails 1 time
    const resB = await recordFailedLogin(sharedNatReq, 'student.two');

    // User B has plenty of attempts remaining despite sharing the NAT IP
    assert.equal(resB.lockedNow, false);
    assert.ok(resB.attemptsRemaining >= 8);
  });

  test('Distributed brute-force attack on a single account across different IPs triggers account lockout', async () => {
    const targetUsername = 'distributed.victim';
    // 50 attempts from 50 distinct IPs
    for (let i = 1; i <= 50; i++) {
      const distinctReq = { ip: `198.51.100.${i}`, socket: {} };
      await recordFailedLogin(distinctReq, targetUsername);
    }

    // Now even from a completely fresh IP 99, the account check detects lockout
    const freshReq = { ip: '198.51.100.99', socket: {} };
    const check = await checkLoginRateLimit(freshReq, targetUsername);
    assert.equal(check.isLocked, true);
  });

  test('Reset rate limits on successful login clears the failed count', async () => {
    const req = { ip: '192.0.2.1', socket: {} };
    const username = 'test.student';

    await recordFailedLogin(req, username);
    await recordSuccessfulLogin(req, username);

    const check = await checkLoginRateLimit(req, username);
    assert.equal(check.isLocked, false);
  });
});

describe('2. YouTube Strict Server-Side Validation & Sanitization', () => {
  test('Accepts valid HTTPS YouTube URLs and normalizes canonical + embed links', () => {
    const urls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/live/dQw4w9WgXcQ',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    ];

    for (const u of urls) {
      const res = validateYouTubeUrl(u);
      assert.equal(res.isValid, true, `Failed for ${u}`);
      assert.equal(res.videoId, 'dQw4w9WgXcQ');
      assert.equal(res.canonicalUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      assert.ok(res.embedUrl.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));
    }
  });

  test('Strictly rejects non-HTTPS (plain HTTP) URLs', () => {
    const res = validateYouTubeUrl('http://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.equal(res.isValid, false);
    assert.ok(res.error.includes('HTTPS protocol is strictly required'));
  });

  test('Strictly rejects malicious protocols (javascript:, data:)', () => {
    const jsRes = validateYouTubeUrl('javascript:alert("XSS")');
    assert.equal(jsRes.isValid, false);

    const dataRes = validateYouTubeUrl('data:text/html,<script>alert(1)</script>');
    assert.equal(dataRes.isValid, false);
  });

  test('Strictly rejects spoofed / arbitrary lookalike domains', () => {
    const spoofed = [
      'https://notyoutube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com.attacker.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.co/watch?v=dQw4w9WgXcQ',
      'https://evil-site.org/video.mp4',
    ];

    for (const u of spoofed) {
      const res = validateYouTubeUrl(u);
      assert.equal(res.isValid, false);
      assert.ok(res.error.includes('Disallowed video domain'));
    }
  });

  test('Rejects invalid video ID lengths (must be strictly 11 characters)', () => {
    const invalidIds = [
      'https://www.youtube.com/watch?v=short',
      'https://www.youtube.com/watch?v=toolongvideoidentifierextra',
      'https://www.youtube.com/watch?v=invalid@char',
    ];

    for (const u of invalidIds) {
      const res = validateYouTubeUrl(u);
      assert.equal(res.isValid, false);
    }
  });
});

describe('3. ReDoS & RegExp Injection Prevention', () => {
  test('Safely escapes regular expression metacharacters', () => {
    const dangerousInput = '.*+?^${}()|[]\\test';
    const escaped = escapeRegex(dangerousInput);
    assert.doesNotThrow(() => {
      new RegExp(escaped, 'i');
    });
    // Check that special characters are escaped
    assert.ok(escaped.includes('\\('));
    assert.ok(escaped.includes('\\['));
    assert.ok(escaped.includes('\\*'));
  });

  test('Unclosed brackets or parentheses do not throw SyntaxError when creating regex', () => {
    const malformedQueries = ['(', '[', '{', '(((a*)*)*)*', ']+', '\\'];
    for (const q of malformedQueries) {
      assert.doesNotThrow(() => {
        const regex = createSafeSearchRegex(q);
        assert.ok(regex instanceof RegExp);
      });
    }
  });

  test('Enforces maximum length to prevent catastrophic ReDoS backtracking', () => {
    const oversizedInput = 'a'.repeat(500);
    const escaped = escapeRegex(oversizedInput, 64);
    assert.equal(escaped.length, 64);
  });

  test('Sanitizes phone numbers for numeric-only search', () => {
    assert.equal(sanitizePhoneSearch('+91 (987) 654-3210'), '9198765432');
    assert.equal(sanitizePhoneSearch('invalid-text'), '');
  });
});

describe('4. Session Invalidation & Token Versioning', () => {
  test('Token embeds sessionId (sid) and tokenVersion', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      username: 'swati.biswal',
      role: 'student',
      batch: '2026',
      tokenVersion: 2,
    };
    const mockSessionId = 'd89c7f1a-3e5b-4c2d-9e1f-8b7a6c5d4e3f';

    const token = generateToken(mockUser, mockSessionId);
    const decoded = verifyToken(token);

    assert.ok(decoded);
    assert.equal(decoded.sub, mockUser._id);
    assert.equal(decoded.sid, mockSessionId);
    assert.equal(decoded.tokenVersion, 2);
  });

  test('requirePasswordChangeComplete blocks users with mustChangePassword=true', () => {
    const reqWithTempPassword = {
      user: {
        mustChangePassword: true,
      },
    };

    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    let nextCalled = false;
    requirePasswordChangeComplete(reqWithTempPassword, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(statusCode, 403);
    assert.equal(jsonBody.code, 'PASSWORD_CHANGE_REQUIRED');
  });

  test('requirePasswordChangeComplete allows users with mustChangePassword=false', () => {
    const reqNormal = {
      user: {
        mustChangePassword: false,
      },
    };

    let nextCalled = false;
    requirePasswordChangeComplete(reqNormal, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });

  test('authenticateUser strictly rejects tokens missing session identifier (sid)', async () => {
    const tokenWithoutSid = jwt.sign(
      { sub: '507f1f77bcf86cd799439011', role: 'student' },
      ENV.JWT_SECRET
    );

    const req = {
      headers: {
        authorization: `Bearer ${tokenWithoutSid}`,
      },
    };

    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    await authenticateUser(req, res, () => {});

    assert.equal(statusCode, 401);
    assert.ok(jsonBody.message.includes('missing session identifier (sid)'));
  });
});

describe('5. Error Handler Sanitization (No Leaks in Production)', () => {
  test('CORS errors return 403 status code with friendly message', () => {
    const corsError = new Error('Origin http://evil.com not allowed by CORS policy.');
    let statusCode = null;
    let jsonBody = null;

    const res = {
      headersSent: false,
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    errorHandler(corsError, { method: 'GET', originalUrl: '/api/lectures' }, res, () => {});

    assert.equal(statusCode, 403);
    assert.equal(jsonBody.success, false);
    assert.ok(jsonBody.message.includes('CORS'));
  });

  test('JWT errors return 401 status code without exposing stack trace', () => {
    const jwtErr = new Error('invalid signature');
    jwtErr.name = 'JsonWebTokenError';

    let statusCode = null;
    let jsonBody = null;

    const res = {
      headersSent: false,
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };

    errorHandler(jwtErr, { method: 'GET', originalUrl: '/api/auth/me' }, res, () => {});

    assert.equal(statusCode, 401);
    assert.equal(jsonBody.message, 'Invalid or expired session token.');
  });
});

describe('6. Teacher Batch Scoping & Access Control', () => {
  test('Superadmin has universal batch access across all batches', () => {
    const req = {
      user: { role: 'superadmin', username: 'aa_superadmin' },
      params: { batchCode: 'BATCH-2026' },
    };
    let nextCalled = false;
    requireAssignedBatch(req, {}, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
  });

  test('Teacher is permitted access for their assigned batches (with or without prefix)', () => {
    const teacherReq = {
      user: {
        role: 'teacher',
        username: 'sudeepdash',
        assignedBatches: ['BATCH-2026', 'BATCH-NEET'],
      },
      params: { batchCode: '2026' },
    };
    let nextCalled = false;
    requireAssignedBatch(teacherReq, {}, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
  });

  test('Teacher is rejected with 403 when attempting to manage an unassigned batch', () => {
    const teacherReq = {
      user: {
        role: 'teacher',
        username: 'sudeepdash',
        assignedBatches: ['BATCH-2026'],
      },
      params: { batchCode: 'BATCH-JEE-ADVANCED' },
    };
    let statusCode = null;
    let jsonBody = null;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      },
    };
    let nextCalled = false;
    requireAssignedBatch(teacherReq, res, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, false);
    assert.equal(statusCode, 403);
    assert.ok(jsonBody.message.includes('not assigned to manage batch'));
  });
});

