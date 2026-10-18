import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { migrateStudentBatches } from './utils/batchMigration.js';

let server;

async function startServer() {
  try {
    // Attempt database connection
    await connectDB().then(async () => {
      await migrateStudentBatches().catch((err) => {
        console.warn('[MIGRATION WARNING]', err.message);
      });
    }).catch((err) => {
      console.warn(
        `[DB WARNING] Could not connect to MongoDB: ${err.message}. Ensure MongoDB is running.`
      );
    });

    server = app.listen(ENV.PORT, () => {
      console.log(`[SERVER] Antariksh Academy API running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
      console.log(`[SERVER] Health check available at http://localhost:${ENV.PORT}/api/health`);
    });
  } catch (error) {
    console.error('[FATAL] Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
async function shutdown(signal) {
  console.log(`\n[SERVER] Received ${signal}. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[SERVER] HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown hangs
    setTimeout(() => {
      console.error('[SERVER] Forcefully terminating server after timeout.');
      process.exit(1);
    }, 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Promise Rejection:', reason instanceof Error ? reason.message : reason);
});

process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:', error.message);
  shutdown('UNCAUGHT_EXCEPTION');
});

startServer();
