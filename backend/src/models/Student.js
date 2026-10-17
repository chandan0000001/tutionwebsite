import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: 'Brahmapur' },
    state: { type: String, trim: true, default: 'Odisha' },
    postalCode: { type: String, trim: true, default: '760001' },
    country: { type: String, trim: true, default: 'India' },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-z0-9_-]{3,30}$/,
        'Username must be between 3 and 30 alphanumeric characters, dashes, or underscores',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never return passwordHash in standard queries
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    fatherName: {
      type: String,
      trim: true,
      default: '',
    },
    motherName: {
      type: String,
      trim: true,
      default: '',
    },
    batch: {
      type: String,
      required: [true, 'Academic batch year is required (e.g. 2026, 2027)'],
      trim: true,
      index: true,
    },
    batchCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
    },
    role: {
      type: String,
      default: 'student',
      immutable: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to synchronize batch and batchCode
studentSchema.pre('save', function (next) {
  if (!this.batchCode && this.batch) {
    this.batchCode = this.batch.startsWith('BATCH-') ? this.batch.toUpperCase() : `BATCH-${this.batch}`.toUpperCase();
  }
  if (!this.batch && this.batchCode) {
    this.batch = this.batchCode.replace('BATCH-', '');
  }
  next();
});

// Method to return safe public/student profile (never leaks passwordHash)
studentSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export const Student = mongoose.model('Student', studentSchema);
