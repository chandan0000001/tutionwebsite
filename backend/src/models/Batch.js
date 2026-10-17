import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Batch name is required (e.g. Batch 2026)'],
      trim: true,
      maxlength: [100, 'Batch name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Unique batch code is required (e.g. BATCH-2026)'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      match: [/^[A-Z0-9_-]{3,20}$/, 'Batch code must be 3-20 uppercase alphanumeric characters or dashes'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required (e.g. 2026)'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Batch = mongoose.model('Batch', batchSchema);
