import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'algoarena_super_secret_jwt_key_2026';

// In-memory user store fallback if MongoDB is disconnected
export const memoryUsers = new Map([
  [
    'demo@algoarena.dev',
    {
      _id: 'mem_user_1',
      username: 'AlgoExplorer',
      email: 'demo@algoarena.dev',
      passwordHash: bcrypt.hashSync('password123', 10),
      xp: 250,
      level: 2,
      completedQuizzes: ['bubbleSort', 'binarySearch'],
      favoriteAlgorithms: ['quickSort', 'astar'],
      battleStats: { wins: 4, total: 6 },
      badges: ['Novice Coder', 'Sorting Apprentice']
    }
  ]
]);

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // If MongoDB is connected
    if (User.db.readyState === 1) {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return res.status(400).json({ message: 'User with this email or username already exists.' });
      }

      const user = await User.create({
        username,
        email,
        passwordHash,
        xp: 100,
        level: 1
      });

      const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          xp: user.xp,
          level: user.level,
          completedQuizzes: user.completedQuizzes,
          favoriteAlgorithms: user.favoriteAlgorithms,
          battleStats: user.battleStats,
          badges: user.badges
        }
      });
    }

    // Fallback in-memory
    if (memoryUsers.has(email)) {
      return res.status(400).json({ message: 'User already exists in session.' });
    }

    const newUser = {
      _id: `mem_${Date.now()}`,
      username,
      email,
      passwordHash,
      xp: 100,
      level: 1,
      completedQuizzes: [],
      favoriteAlgorithms: [],
      battleStats: { wins: 0, total: 0 },
      badges: ['Novice Coder']
    };
    memoryUsers.set(email, newUser);

    const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      token,
      user: newUser
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // If MongoDB connected
    if (User.db.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          xp: user.xp,
          level: user.level,
          completedQuizzes: user.completedQuizzes,
          favoriteAlgorithms: user.favoriteAlgorithms,
          battleStats: user.battleStats,
          badges: user.badges
        }
      });
    }

    // Fallback in-memory
    const user = memoryUsers.get(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({
      token,
      user
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    if (User.db.readyState === 1) {
      const user = await User.findById(req.user.id).select('-passwordHash');
      if (!user) return res.status(404).json({ message: 'User not found.' });
      return res.json({ user });
    }

    // In-memory
    const user = Array.from(memoryUsers.values()).find(u => u._id === req.user.id || u.email === req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching profile.', error: err.message });
  }
}
