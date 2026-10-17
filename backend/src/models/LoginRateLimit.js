import mongoose from 'mongoose';

const loginRateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['ip', 'username', 'ip_user', 'global'],
      index: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
    firstAttempt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastAttempt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    expireAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index: auto-deletes expired records
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast query resolution
loginRateLimitSchema.index({ type: 1, key: 1 });

export const LoginRateLimit = mongoose.model('LoginRateLimit', loginRateLimitSchema);
