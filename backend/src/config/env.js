import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env first, then fallback to cwd .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const stripQuotes = (val) => {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

// 1. Validate NODE_ENV strictly
const VALID_ENVIRONMENTS = new Set(['development', 'test', 'production']);
const rawNodeEnv = stripQuotes(process.env.NODE_ENV);

if (rawNodeEnv && !VALID_ENVIRONMENTS.has(rawNodeEnv)) {
  throw new Error(
    `[FATAL SECURITY CONFIGURATION] Invalid NODE_ENV '${rawNodeEnv}'. Expected one of: development, test, production.`
  );
}

const NODE_ENV = rawNodeEnv || 'development';
const isProduction = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDevelopment = NODE_ENV === 'development';

// 2. Production strict validation
const KNOWN_PLACEHOLDER_SUBSTRINGS = [
  'dev_secret_antariksh_academy_super_secure_jwt_key',
  'replace_with_a_long_random_secret',
  'replace_with',
  'your_secret_here',
  'insert_secret',
];

const EXACT_INSECURE_WORDS = new Set([
  'secret',
  'changeme',
  'password',
  'admin',
  'jwt_secret',
  'jwtsecret',
]);

const rawJwtSecret = stripQuotes(process.env.JWT_SECRET);
const rawMongoUri = stripQuotes(process.env.MONGODB_URI);

if (isProduction) {
  if (!rawMongoUri) {
    throw new Error('[FATAL] Missing required production environment variable: MONGODB_URI');
  }

  if (!rawJwtSecret) {
    throw new Error('[FATAL] Missing required production environment variable: JWT_SECRET');
  }

  if (rawJwtSecret.length < 32) {
    throw new Error('[FATAL] JWT_SECRET must be at least 32 characters long in production.');
  }

  const lowerSecret = rawJwtSecret.toLowerCase();

  if (EXACT_INSECURE_WORDS.has(lowerSecret)) {
    throw new Error(
      '[FATAL SECURITY CONFIGURATION] Insecure placeholder JWT_SECRET detected in production. You must configure a unique, cryptographically random secret in Render dashboard.'
    );
  }

  for (const ph of KNOWN_PLACEHOLDER_SUBSTRINGS) {
    if (lowerSecret.includes(ph)) {
      throw new Error(
        '[FATAL SECURITY CONFIGURATION] Insecure placeholder JWT_SECRET detected in production. You must configure a unique, cryptographically random secret in Render dashboard.'
      );
    }
  }
}

// Development fallback JWT secret: ONLY permitted in local development or unit testing
const devJwtSecret =
  rawJwtSecret ||
  (isDevelopment || isTest
    ? 'dev_only_local_jwt_secret_antariksh_academy_super_secure_32chars_minimum'
    : '');

if (!devJwtSecret && !isProduction) {
  throw new Error('[FATAL] JWT_SECRET must be defined.');
}

// 3. Proxy trust configuration for Render / Reverse Proxies
// On Render, there is 1 proxy layer (Render reverse proxy). Default to 1 in production.
// Can be customized via TRUST_PROXY (e.g. "1", "true", "false", "loopback")
let trustProxySetting = false;
if (process.env.TRUST_PROXY !== undefined) {
  const tp = stripQuotes(process.env.TRUST_PROXY).toLowerCase();
  if (tp === 'true') trustProxySetting = true;
  else if (tp === 'false') trustProxySetting = false;
  else if (!isNaN(Number(tp))) trustProxySetting = Number(tp);
  else trustProxySetting = tp;
} else if (isProduction) {
  // Render deployment runs behind 1 reverse proxy hop
  trustProxySetting = 1;
}

// 4. Allowed Origins (CORS)
const frontendUrl = stripQuotes(process.env.FRONTEND_URL) || 'http://localhost:5173';
const envAllowedOrigins = stripQuotes(process.env.ALLOWED_ORIGINS);
const parsedAllowedOrigins = envAllowedOrigins
  ? envAllowedOrigins.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const defaultDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];
const allowedOriginsList = Array.from(
  new Set([
    frontendUrl,
    ...(isProduction ? [] : defaultDevOrigins),
    ...parsedAllowedOrigins,
  ])
).filter(Boolean);

export const ENV = {
  NODE_ENV,
  isProduction,
  isDevelopment,
  isTest,
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: rawMongoUri || 'mongodb://127.0.0.1:27017/antariksh_academy',
  JWT_SECRET: isProduction ? rawJwtSecret : devJwtSecret,
  JWT_EXPIRES_IN: stripQuotes(process.env.JWT_EXPIRES_IN) || '1d',
  FRONTEND_URL: frontendUrl,
  ALLOWED_ORIGINS: allowedOriginsList,
  TRUST_PROXY: trustProxySetting,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  SUPERADMIN_USERNAME: stripQuotes(process.env.SUPERADMIN_USERNAME) || 'aa_superadmin',
  SUPERADMIN_PASSWORD: stripQuotes(process.env.SUPERADMIN_PASSWORD) || '',
  TEACHER_1_USERNAME: stripQuotes(process.env.TEACHER_1_USERNAME) || 'sudeepdash',
  TEACHER_1_PASSWORD: stripQuotes(process.env.TEACHER_1_PASSWORD) || '',
  TEACHER_2_USERNAME: stripQuotes(process.env.TEACHER_2_USERNAME) || 'prasantbehera',
  TEACHER_2_PASSWORD: stripQuotes(process.env.TEACHER_2_PASSWORD) || '',
};
