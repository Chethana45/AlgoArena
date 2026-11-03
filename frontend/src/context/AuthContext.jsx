import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const GUEST_KEY = 'algoarena_guest_user';
const TOKEN_KEY = 'algoarena_jwt_token';

const defaultGuest = {
  username: 'AlgoExplorer',
  email: 'explorer@algoarena.dev',
  xp: 150,
  level: 1,
  completedQuizzes: ['bubbleSort'],
  favoriteAlgorithms: ['quickSort', 'astar'],
  battleStats: { wins: 3, total: 5 },
  badges: ['First Step', 'Sorting Apprentice']
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Load user
  useEffect(() => {
    async function initUser() {
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Backend unavailable, falling back to local session', e);
        }
      }

      // Fallback to guest profile
      const storedGuest = localStorage.getItem(GUEST_KEY);
      if (storedGuest) {
        try {
          setUser(JSON.parse(storedGuest));
        } catch {
          setUser(defaultGuest);
        }
      } else {
        setUser(defaultGuest);
        localStorage.setItem(GUEST_KEY, JSON.stringify(defaultGuest));
      }
      setLoading(false);
    }

    initUser();
  }, [token]);

  const saveUserLocal = (updated) => {
    setUser(updated);
    localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      // Local fallback mock login for instant demo experience
      const fallbackUser = {
        username: email.split('@')[0],
        email,
        xp: 250,
        level: 2,
        completedQuizzes: ['bubbleSort', 'binarySearch'],
        favoriteAlgorithms: ['mergeSort', 'dijkstra'],
        battleStats: { wins: 5, total: 8 },
        badges: ['First Step', 'Sorting Apprentice', 'Explorer']
      };
      setUser(fallbackUser);
      localStorage.setItem(GUEST_KEY, JSON.stringify(fallbackUser));
      return { success: true, offline: true };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const newUser = {
        username,
        email,
        xp: 100,
        level: 1,
        completedQuizzes: [],
        favoriteAlgorithms: [],
        battleStats: { wins: 0, total: 0 },
        badges: ['Novice Coder']
      };
      setUser(newUser);
      localStorage.setItem(GUEST_KEY, JSON.stringify(newUser));
      return { success: true, offline: true };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    setUser(defaultGuest);
    localStorage.setItem(GUEST_KEY, JSON.stringify(defaultGuest));
  };

  const addXP = (amount) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    const updated = { ...user, xp: newXP, level: newLevel };
    saveUserLocal(updated);

    // Sync with backend if logged in
    if (token) {
      fetch('/api/progress/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ xp: amount })
      }).catch(() => {});
    }
  };

  const completeQuiz = (algoId, score) => {
    if (!user) return;
    const completed = user.completedQuizzes || [];
    if (!completed.includes(algoId)) {
      const updatedList = [...completed, algoId];
      const xpGained = score * 50;
      const updated = {
        ...user,
        completedQuizzes: updatedList,
        xp: (user.xp || 0) + xpGained,
        level: Math.floor(((user.xp || 0) + xpGained) / 200) + 1
      };
      saveUserLocal(updated);
    }
  };

  const toggleFavorite = (algoId) => {
    if (!user) return;
    const favs = user.favoriteAlgorithms || [];
    const updatedFavs = favs.includes(algoId)
      ? favs.filter(id => id !== algoId)
      : [...favs, algoId];
    const updated = { ...user, favoriteAlgorithms: updatedFavs };
    saveUserLocal(updated);
  };

  const recordBattle = (won = true) => {
    if (!user) return;
    const stats = user.battleStats || { wins: 0, total: 0 };
    const updatedStats = {
      wins: won ? stats.wins + 1 : stats.wins,
      total: stats.total + 1
    };
    const xpBonus = won ? 60 : 25;
    const updated = {
      ...user,
      battleStats: updatedStats,
      xp: (user.xp || 0) + xpBonus,
      level: Math.floor(((user.xp || 0) + xpBonus) / 200) + 1
    };
    saveUserLocal(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      addXP,
      completeQuiz,
      toggleFavorite,
      recordBattle
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
