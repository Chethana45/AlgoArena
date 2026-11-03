import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/algoarena';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AlgoArena API',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// Database connection attempt
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2500
}).then(() => {
  console.log('✓ Successfully connected to MongoDB at', MONGODB_URI);
}).catch((err) => {
  console.warn('! MongoDB not detected locally (' + err.message + '). Operating seamlessly with in-memory persistence mode.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AlgoArena Backend Server listening on port http://localhost:${PORT}`);
});
