import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  algorithmId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['visualized', 'battle_won', 'battle_lost', 'quiz_completed'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export const Progress = mongoose.model('Progress', progressSchema);
