import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userModel: {
      type: String,
      required: true,
      enum: ['Staff', 'Student'],
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'superadmin'],
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    tokenVersion: {
      type: Number,
      default: 1,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revocationReason: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index: auto-deletes expired sessions
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for active session lookups
sessionSchema.index({ sessionId: 1, isRevoked: 1 });
sessionSchema.index({ userId: 1, isRevoked: 1 });

export const Session = mongoose.model('Session', sessionSchema);
