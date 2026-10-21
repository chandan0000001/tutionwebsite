import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      ref: 'Staff',
      index: true,
    },
    actorUsername: {
      type: String,
      required: true,
      trim: true,
      default: 'system',
      index: true,
    },
    actorRole: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ['teacher', 'superadmin', 'admin', 'system', 'student', 'staff'],
      default: 'system',
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    targetType: {
      type: String,
      required: true,
      trim: true,
      default: 'System',
      index: true,
    },
    targetId: {
      type: String,
      trim: true,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

