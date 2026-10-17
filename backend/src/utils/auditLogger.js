import { AuditLog } from '../models/AuditLog.js';

/**
 * Record an administrative action in the audit log
 * Never logs passwords, secrets, or sensitive tokens.
 */
export async function recordAuditLog({
  req,
  actor,
  action,
  targetType,
  targetId = '',
  details = {},
}) {
  try {
    const user = actor || req?.user;
    if (!user) return;

    // Sanitize details: strip out any inadvertent password or token fields
    const safeDetails = { ...details };
    delete safeDetails.password;
    delete safeDetails.passwordHash;
    delete safeDetails.temporaryPassword;
    delete safeDetails.token;

    const ipAddress =
      req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req?.socket?.remoteAddress ||
      '';

    await AuditLog.create({
      actorId: user._id,
      actorUsername: user.username,
      actorRole: user.role,
      action,
      targetType,
      targetId: String(targetId || ''),
      details: safeDetails,
      ipAddress,
    });
  } catch (err) {
    // Audit log failure should never crash the primary business logic
    console.error('[AUDIT LOG ERROR]:', err.message);
  }
}
