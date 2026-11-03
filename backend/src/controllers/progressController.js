import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { memoryUsers } from './authController.js';

export async function addXP(req, res) {
  try {
    const { xp } = req.body;
    const amount = Number(xp) || 10;

    if (User.db.readyState === 1) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.xp = (user.xp || 0) + amount;
      user.level = Math.floor(user.xp / 200) + 1;
      await user.save();
      return res.json({ xp: user.xp, level: user.level });
    }

    // In-memory
    const user = Array.from(memoryUsers.values()).find(u => u._id === req.user.id || u.email === req.user.email);
    if (user) {
      user.xp = (user.xp || 0) + amount;
      user.level = Math.floor(user.xp / 200) + 1;
      return res.json({ xp: user.xp, level: user.level });
    }
    return res.json({ xp: 150, level: 1 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function toggleFavorite(req, res) {
  try {
    const { algorithmId } = req.body;
    if (!algorithmId) return res.status(400).json({ message: 'algorithmId required' });

    if (User.db.readyState === 1) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const idx = user.favoriteAlgorithms.indexOf(algorithmId);
      if (idx !== -1) user.favoriteAlgorithms.splice(idx, 1);
      else user.favoriteAlgorithms.push(algorithmId);
      await user.save();
      return res.json({ favorites: user.favoriteAlgorithms });
    }

    const user = Array.from(memoryUsers.values()).find(u => u._id === req.user.id || u.email === req.user.email);
    if (user) {
      const favs = user.favoriteAlgorithms || [];
      const idx = favs.indexOf(algorithmId);
      if (idx !== -1) favs.splice(idx, 1);
      else favs.push(algorithmId);
      user.favoriteAlgorithms = favs;
      return res.json({ favorites: favs });
    }
    return res.json({ favorites: [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function recordActivity(req, res) {
  try {
    const { algorithmId, action, details } = req.body;
    if (User.db.readyState === 1) {
      const prog = await Progress.create({
        userId: req.user.id,
        algorithmId,
        action,
        details
      });
      return res.status(201).json({ progress: prog });
    }
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
