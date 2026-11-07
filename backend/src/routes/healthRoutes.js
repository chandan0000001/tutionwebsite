import express from 'express';
import mongoose from 'mongoose';
import { isRedisConnected } from '../config/redis.js';

const router = express.Router();

router.get('/', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'ok',
    service: 'Antariksh Academy Backend API',
    uptime: Math.floor(process.uptime()),
    database: isDbConnected ? 'connected' : 'disconnected',
    redis: isRedisConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default router;
