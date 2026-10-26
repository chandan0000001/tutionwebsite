import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import studentBatchRoutes from './routes/studentBatchRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import superadminRoutes from './routes/superadminRoutes.js';

const app = express();

// 1. Configure trusted reverse proxy depth
// Render uses 1 reverse proxy layer. Express calculates req.ip securely based on this.
// Never blindly set app.set('trust proxy', true).
if (ENV.TRUST_PROXY !== false) {
  app.set('trust proxy', ENV.TRUST_PROXY);
}

// 2. Security HTTP headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Pure REST API server; CSP enforced on frontend/Vercel
  })
);

// 3. Strict CORS configuration with explicit origin allowlist
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);

      if (ENV.ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      } else {
        const corsError = new Error(`Origin '${origin}' not allowed by CORS policy.`);
        corsError.statusCode = 403;
        return callback(corsError);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Cache-Control',
      'Pragma',
      'Accept',
      'Origin',
    ],
  })
);

// 4. Body parsing with safe size limit (prevent denial of service)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Mount API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/students', studentBatchRoutes);
app.use('/api/student', studentBatchRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/superadmin', superadminRoutes);

// 6. Catch-all for undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' does not exist.`,
  });
});

// 7. Centralized sanitized error handler
app.use(errorHandler);

export default app;
