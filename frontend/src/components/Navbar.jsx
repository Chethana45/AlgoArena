import React, { useState } from 'react';
import {
  Swords,
  Play,
  BookOpen,
  TrendingUp,
  Trophy,
  LayoutDashboard,
  Sparkles,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'visualizer', label: 'Visualizer', icon: Play },
    { id: 'battle', label: 'Algorithm Battle', icon: Swords, badge: 'HOT' },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'complexity', label: 'Complexity Analyzer', icon: TrendingUp },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-surfaceBorder/50 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-purple flex items-center justify-center shadow-lg shadow-brand-purple/20 group-hover:scale-105 transition-transform">
              <Swords className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-cyan rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-brand-cyan bg-clip-text text-transparent">
                  AlgoArena
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-accent/20 text-brand-cyan border border-brand-accent/40">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-gray-400 -mt-1 font-mono">Algorithm Combat & Insight</p>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-brand-accent/20 to-brand-purple/20 border border-brand-purple/40 shadow-sm shadow-brand-purple/20'
                      : 'text-gray-300 hover:text-white hover:bg-surfaceLight/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-black tracking-wide px-1.5 py-0.2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile / Status */}
          <div className="flex items-center gap-3">
            {/* XP and Level Pill */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surfaceLight/60 border border-surfaceBorder/80 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-amber-300">{user.xp || 0} XP</span>
                <span className="w-1 h-1 rounded-full bg-gray-500" />
                <span className="text-gray-300 font-mono">Lvl {user.level || 1}</span>
              </div>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 border border-surfaceBorder/80 transition-all text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-accent to-brand-cyan flex items-center justify-center font-bold text-xs text-white">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-gray-200">{user.username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel rounded-xl shadow-xl py-2 border border-surfaceBorder/80 z-50">
                    <div className="px-4 py-2 border-b border-surfaceBorder/50">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email || user.username}</p>
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-300 border-b border-surfaceBorder/50">
                      <div className="flex justify-between py-0.5">
                        <span className="text-gray-400">Quizzes Passed</span>
                        <span className="font-bold text-brand-cyan">{user.completedQuizzes?.length || 0}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-gray-400">Battle Wins</span>
                        <span className="font-bold text-brand-emerald">{user.battleStats?.wins || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-accent to-brand-purple hover:opacity-95 text-white font-medium text-sm shadow-md shadow-brand-purple/30 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-surfaceBorder/40 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-brand-accent/20 border border-brand-accent/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
