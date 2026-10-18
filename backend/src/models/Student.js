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
        /^[a-z0-9._-]{3,60}$/,
        'Username must be between 3 and 60 alphanumeric characters, dots, dashes, or underscores',
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
      trim: true,
      index: true,
      default: '',
    },
    batchCode: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
      default: '',
    },
    batchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        index: true,
      },
    ],
    batchCodes: [
      {
        type: String,
        trim: true,
        uppercase: true,
        index: true,
      },
    ],
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
    temporaryPasswordExpiresAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to synchronize multi-batch arrays and legacy single fields
studentSchema.pre('save', function (next) {
  if (!Array.isArray(this.batchCodes)) {
    this.batchCodes = [];
  }
  if (!Array.isArray(this.batchIds)) {
    this.batchIds = [];
  }

  // Normalize and deduplicate batchCodes
  this.batchCodes = Array.from(
    new Set(this.batchCodes.map((c) => String(c).trim().toUpperCase()).filter(Boolean))
  );

  // Synchronize legacy single-batch input into array
  if (this.batchCode) {
    const cleanCode = this.batchCode.trim().toUpperCase();
    if (!this.batchCodes.includes(cleanCode)) {
      this.batchCodes.push(cleanCode);
    }
  } else if (this.batch) {
    const clean = String(this.batch).trim().toUpperCase();
    const code = clean.startsWith('BATCH-') ? clean : `BATCH-${clean}`;
    if (!this.batchCodes.includes(code)) {
      this.batchCodes.push(code);
    }
  }

  // Synchronize primary batch & batchCode
  if (this.batchCodes.length === 0) {
    this.batchCode = '';
    this.batch = '';
  } else {
    // If current batchCode is valid and in batchCodes, keep it; otherwise default to first
    if (!this.batchCode || !this.batchCodes.includes(this.batchCode.toUpperCase())) {
      this.batchCode = this.batchCodes[0];
    } else {
      this.batchCode = this.batchCode.toUpperCase();
    }
    this.batch = this.batchCode.replace('BATCH-', '');
  }

  next();
});

// Method to return safe public/student profile (never leaks passwordHash)
studentSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  obj.batchIds = Array.isArray(obj.batchIds) ? obj.batchIds : [];
  obj.batchCodes = Array.isArray(obj.batchCodes) && obj.batchCodes.length > 0
    ? obj.batchCodes
    : (obj.batchCode ? [obj.batchCode] : []);
  return obj;
};

export const Student = mongoose.model('Student', studentSchema);
