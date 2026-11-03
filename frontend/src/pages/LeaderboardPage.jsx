import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Swords,
  BookOpen,
  Crown,
  Search,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('all'); // 'all' | 'weekly'
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default mock leaderboard data if backend is offline
  const fallbackLeaderboard = [
    { rank: 1, username: 'ByteMaster_99', xp: 1450, level: 7, quizzesCount: 14, battleWins: 28, badge: 'Grandmaster' },
    { rank: 2, username: 'AlgorithmAce', xp: 1220, level: 6, quizzesCount: 12, battleWins: 22, badge: 'Master' },
    { rank: 3, username: 'CodeNinjaX', xp: 1050, level: 5, quizzesCount: 10, battleWins: 19, badge: 'Expert' },
    { rank: 4, username: 'GraphGuru', xp: 920, level: 4, quizzesCount: 9, battleWins: 15, badge: 'Specialist' },
    { rank: 5, username: 'BinaryBoss', xp: 810, level: 4, quizzesCount: 8, battleWins: 13, badge: 'Specialist' },
    { rank: 6, username: 'SortSorcerer', xp: 740, level: 3, quizzesCount: 7, battleWins: 11, badge: 'Practitioner' },
    { rank: 7, username: 'MemoizeQueen', xp: 680, level: 3, quizzesCount: 6, battleWins: 10, badge: 'Practitioner' },
    { rank: 8, username: 'DynamicDev', xp: 590, level: 2, quizzesCount: 5, battleWins: 8, badge: 'Apprentice' },
    { rank: 9, username: 'ArrayArcher', xp: 480, level: 2, quizzesCount: 4, battleWins: 6, badge: 'Apprentice' },
    { rank: 10, username: 'NullPointerHero', xp: 350, level: 1, quizzesCount: 3, battleWins: 4, badge: 'Novice' },
  ];

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setLeaderboardData(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend leaderboard unreachable, showing local rank data');
      }

      // Merge current user into list if present
      let list = [...fallbackLeaderboard];
      if (user) {
        const existingIdx = list.findIndex(u => u.username === user.username);
        const currentUserData = {
          username: user.username,
          xp: user.xp || 150,
          level: user.level || 1,
          quizzesCount: user.completedQuizzes?.length || 1,
          battleWins: user.battleStats?.wins || 0,
          badge: (user.xp || 0) > 800 ? 'Specialist' : 'Apprentice',
          isCurrentUser: true
        };

        if (existingIdx !== -1) {
          list[existingIdx] = { ...list[existingIdx], ...currentUserData };
        } else {
          list.push(currentUserData);
        }

        // Sort descending by XP
        list.sort((a, b) => b.xp - a.xp);
        list = list.map((item, index) => ({ ...item, rank: index + 1 }));
      }

      setLeaderboardData(list);
      setLoading(false);
    }

    fetchLeaderboard();
  }, [user]);

  const filteredData = leaderboardData.filter(item =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-brand-purple flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Global Arena Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Top competitive algorithm visualizers, quiz aces, and battle champions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surfaceLight p-1 rounded-xl border border-surfaceBorder text-xs">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeframe === 'all' ? 'bg-brand-accent text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeframe === 'weekly' ? 'bg-brand-purple text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Rank 2 */}
        {leaderboardData[1] && (
          <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/80 shadow-lg flex flex-col items-center text-center space-y-3 relative order-2 md:order-1">
            <div className="w-12 h-12 rounded-full bg-gray-400/20 border-2 border-gray-300 flex items-center justify-center text-gray-300 font-extrabold text-lg shadow-md">
              🥈 2
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{leaderboardData[1].username}</h3>
              <span className="text-xs text-gray-400 font-mono">Level {leaderboardData[1].level}</span>
            </div>
            <div className="w-full pt-3 border-t border-surfaceBorder/50 flex justify-around text-xs">
              <div>
                <span className="text-gray-500 block text-[10px]">XP</span>
                <span className="font-bold text-amber-400 font-mono">{leaderboardData[1].xp}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Wins</span>
                <span className="font-bold text-brand-cyan font-mono">{leaderboardData[1].battleWins}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 1 (Crown) */}
        {leaderboardData[0] && (
          <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/50 shadow-2xl flex flex-col items-center text-center space-y-3 relative order-1 md:order-2 bg-gradient-to-b from-amber-500/10 to-surface/90 scale-105">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/50">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-extrabold text-xl shadow-lg mt-2">
              🥇 1
            </div>
            <div>
              <h3 className="font-black text-white text-lg">{leaderboardData[0].username}</h3>
              <span className="text-xs text-amber-300 font-bold font-mono">Level {leaderboardData[0].level} • {leaderboardData[0].badge}</span>
            </div>
            <div className="w-full pt-3 border-t border-surfaceBorder/50 flex justify-around text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">XP</span>
                <span className="font-black text-amber-400 text-sm font-mono">{leaderboardData[0].xp}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Wins</span>
                <span className="font-black text-brand-cyan text-sm font-mono">{leaderboardData[0].battleWins}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Quizzes</span>
                <span className="font-black text-emerald-400 text-sm font-mono">{leaderboardData[0].quizzesCount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {leaderboardData[2] && (
          <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/80 shadow-lg flex flex-col items-center text-center space-y-3 relative order-3">
            <div className="w-12 h-12 rounded-full bg-amber-700/20 border-2 border-amber-600 flex items-center justify-center text-amber-500 font-extrabold text-lg shadow-md">
              🥉 3
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{leaderboardData[2].username}</h3>
              <span className="text-xs text-gray-400 font-mono">Level {leaderboardData[2].level}</span>
            </div>
            <div className="w-full pt-3 border-t border-surfaceBorder/50 flex justify-around text-xs">
              <div>
                <span className="text-gray-500 block text-[10px]">XP</span>
                <span className="font-bold text-amber-400 font-mono">{leaderboardData[2].xp}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">Wins</span>
                <span className="font-bold text-brand-cyan font-mono">{leaderboardData[2].battleWins}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table with Search */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Medal className="w-4 h-4 text-brand-purple" />
            <span>Full Standings</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search coder by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surfaceLight border border-surfaceBorder rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surfaceBorder/80 text-gray-400 bg-surfaceLight/40">
                <th className="p-3">Rank</th>
                <th className="p-3 font-sans">Coder</th>
                <th className="p-3 text-amber-400">XP Points</th>
                <th className="p-3">Level</th>
                <th className="p-3 text-brand-cyan">Battle Wins</th>
                <th className="p-3 text-emerald-400">Quizzes Passed</th>
                <th className="p-3 font-sans">Badge Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceBorder/40">
              {filteredData.map((item) => {
                const isYou = item.username === user?.username;

                return (
                  <tr
                    key={item.username}
                    className={`transition-colors ${
                      isYou
                        ? 'bg-brand-accent/20 border-l-4 border-brand-cyan'
                        : 'hover:bg-surfaceLight/30'
                    }`}
                  >
                    <td className="p-3 font-bold">
                      {item.rank === 1 && '🥇 1'}
                      {item.rank === 2 && '🥈 2'}
                      {item.rank === 3 && '🥉 3'}
                      {item.rank > 3 && `#${item.rank}`}
                    </td>
                    <td className="p-3 font-sans font-semibold text-white whitespace-nowrap flex items-center gap-2">
                      <span>{item.username}</span>
                      {isYou && (
                        <span className="px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan text-[10px] font-bold">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-amber-400 font-bold">{item.xp} XP</td>
                    <td className="p-3 text-gray-300">Lvl {item.level}</td>
                    <td className="p-3 text-brand-cyan font-semibold">{item.battleWins}</td>
                    <td className="p-3 text-emerald-400 font-semibold">{item.quizzesCount}</td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-surfaceLight text-gray-300 border border-surfaceBorder text-[10px]">
                        {item.badge || 'Apprentice'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
