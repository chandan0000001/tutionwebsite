import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// In production, validate critical variables
if (isProduction) {
  const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `[FATAL] Missing required production environment variable(s): ${missing.join(', ')}`
    );
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error(
      '[FATAL] JWT_SECRET must be at least 32 characters long in production.'
    );
  }
}

export const ENV = {
  NODE_ENV,
  isProduction,
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antariksh_academy',
  JWT_SECRET:
    process.env.JWT_SECRET || 'dev_secret_antariksh_academy_super_secure_jwt_key_993818471928472918471',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
};
