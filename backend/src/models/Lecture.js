import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    slNo: {
      type: Number,
      required: [true, 'Lecture serial number is required'],
      min: [1, 'Serial number must be at least 1'],
    },
    topicName: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
      maxlength: [200, 'Topic name cannot exceed 200 characters'],
    },
    ytVideoLink: {
      type: String,
      required: [true, 'YouTube video link or embed URL is required'],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, 'Target batch year is required (e.g. 2026, 2027)'],
      trim: true,
      index: true,
    },
    batchCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required (Physics, Chemistry, Mathematics, Biology, etc.)'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: String,
      default: 'system',
    },
    lastUpdatedBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to synchronize batch and batchCode
lectureSchema.pre('save', function (next) {
  if (!this.batchCode && this.batch) {
    this.batchCode = this.batch.startsWith('BATCH-') ? this.batch.toUpperCase() : `BATCH-${this.batch}`.toUpperCase();
  }
  if (!this.batch && this.batchCode) {
    this.batch = this.batchCode.replace('BATCH-', '');
  }
  next();
});

// Compound index for high-performance batch-filtered, published lecture retrieval
lectureSchema.index({ batch: 1, isPublished: 1, slNo: 1 });
lectureSchema.index({ batchCode: 1, isPublished: 1, slNo: 1 });

export const Lecture = mongoose.model('Lecture', lectureSchema);
