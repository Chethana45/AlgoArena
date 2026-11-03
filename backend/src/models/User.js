import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 100
  },
  level: {
    type: Number,
    default: 1
  },
  completedQuizzes: {
    type: [String],
    default: []
  },
  favoriteAlgorithms: {
    type: [String],
    default: []
  },
  battleStats: {
    wins: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  badges: {
    type: [String],
    default: ['Novice Coder']
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
