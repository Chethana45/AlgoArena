import { User } from '../models/User.js';
import { memoryUsers } from './authController.js';

export async function getLeaderboard(req, res) {
  try {
    if (User.db.readyState === 1) {
      const topUsers = await User.find({})
        .sort({ xp: -1 })
        .limit(20)
        .select('username xp level completedQuizzes battleStats badges');

      const formatted = topUsers.map((u, idx) => ({
        rank: idx + 1,
        username: u.username,
        xp: u.xp,
        level: u.level,
        quizzesCount: u.completedQuizzes?.length || 0,
        battleWins: u.battleStats?.wins || 0,
        badge: u.badges?.[u.badges.length - 1] || 'Apprentice'
      }));

      return res.json(formatted);
    }

    // In-memory fallback
    const all = Array.from(memoryUsers.values());
    all.sort((a, b) => (b.xp || 0) - (a.xp || 0));

    const formatted = all.slice(0, 20).map((u, idx) => ({
      rank: idx + 1,
      username: u.username,
      xp: u.xp,
      level: u.level,
      quizzesCount: u.completedQuizzes?.length || 0,
      battleWins: u.battleStats?.wins || 0,
      badge: u.badges?.[u.badges.length - 1] || 'Apprentice'
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
