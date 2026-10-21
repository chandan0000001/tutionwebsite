import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog.js';

/**
 * Record an administrative action in the audit log
 * Never logs passwords, secrets, or sensitive tokens.
 */
export async function recordAuditLog({
  req,
  actor,
  action,
  targetType = 'System',
  targetId = '',
  details = {},
}) {
  try {
    const user = actor || req?.user;
    if (!user) return null;

    // Sanitize details: strip out any inadvertent password or token fields
    const safeDetails = { ...details };
    delete safeDetails.password;
    delete safeDetails.passwordHash;
    delete safeDetails.temporaryPassword;
    delete safeDetails.token;

    // Extract safe actor ID (handle ObjectId, string representation, or missing ID)
    let actorId = user._id || user.id || req?.user?._id;
    if (!actorId || !mongoose.Types.ObjectId.isValid(actorId)) {
      actorId = new mongoose.Types.ObjectId();
    } else if (typeof actorId === 'string') {
      actorId = new mongoose.Types.ObjectId(actorId);
    }

    // Extract username
    const actorUsername =
      user.username ||
      user.name ||
      user.email ||
      req?.user?.username ||
      'system';

    // Normalize role (case-insensitive, convert "admin" -> "superadmin")
    const rawRole = (user.role || req?.user?.role || 'system').toString().trim().toLowerCase();
    const actorRole = rawRole === 'admin' ? 'superadmin' : rawRole;

    const ipAddress =
      req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req?.ip ||
      req?.socket?.remoteAddress ||
      '127.0.0.1';

    const logEntry = await AuditLog.create({
      actorId,
      actorUsername,
      actorRole,
      action: String(action || 'UNKNOWN_ACTION').trim().toUpperCase(),
      targetType: String(targetType || 'System').trim(),
      targetId: String(targetId || ''),
      details: safeDetails,
      ipAddress,
    });

    return logEntry;
  } catch (err) {
    // Audit log failure should never crash the primary business logic
    console.error(`[AUDIT LOG ERROR] Failed to record action '${action}':`, err.message);
    return null;
  }
}

