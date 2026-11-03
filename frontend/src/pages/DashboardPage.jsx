import React from 'react';
import {
  Swords,
  Play,
  BookOpen,
  TrendingUp,
  Trophy,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  BarChart2,
  Search,
  GitBranch,
  Table
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_ALGORITHMS, ALGORITHM_CATEGORIES } from '../algorithms';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();

  const xp = user?.xp || 150;
  const level = user?.level || 1;
  const nextLevelXP = level * 200;
  const currentLevelProgress = Math.min(100, Math.round(((xp % 200) / 200) * 100));

  const completedQuizzes = user?.completedQuizzes || [];
  const battleWins = user?.battleStats?.wins || 0;
  const totalBattles = user?.battleStats?.total || 0;
  const winRate = totalBattles > 0 ? Math.round((battleWins / totalBattles) * 100) : 0;

  const categoryIcons = {
    sorting: BarChart2,
    searching: Search,
    graph: GitBranch,
    'dynamic-programming': Table
  };

  const featuredMatchup = {
    name: 'Quick Sort vs Merge Sort',
    algoA: 'quickSort',
    algoB: 'mergeSort',
    category: 'sorting',
    description: 'The definitive divide-and-conquer showdown. Cache speed vs guaranteed O(n log n) stability.'
  };

  const quickAlgorithms = [
    { id: 'quickSort', name: 'Quick Sort', category: 'sorting', complexity: 'O(n log n)', tag: 'Popular' },
    { id: 'mergeSort', name: 'Merge Sort', category: 'sorting', complexity: 'O(n log n)', tag: 'Stable' },
    { id: 'astar', name: 'A* Pathfinding', category: 'graph', complexity: 'O(E)', tag: 'Game Dev' },
    { id: 'dijkstra', name: "Dijkstra's Path", category: 'graph', complexity: 'O((V+E) log V)', tag: 'GPS Routing' },
    { id: 'binarySearch', name: 'Binary Search', category: 'searching', complexity: 'O(log n)', tag: 'Core' },
    { id: 'knapsack', name: '0/1 Knapsack', category: 'dynamic-programming', complexity: 'O(n · W)', tag: 'Optimization' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Developer Hero Section */}
      <div className="relative overflow-hidden glass-panel p-6 sm:p-8 rounded-3xl border border-surfaceBorder/80 shadow-2xl bg-gradient-to-br from-surface/90 via-surfaceLight/40 to-[#0B0F19]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-cyan text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Interactive Algorithm Battle & Visualization Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-brand-cyan via-indigo-200 to-brand-purple bg-clip-text text-transparent">{user?.username || 'AlgoExplorer'}</span>!
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Step into the combat zone where algorithms clash in real-time. Dissect their runtime execution step by step, test your knowledge in quizzes, and climb the global leaderboard.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('battle')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-brand-purple hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all"
              >
                <Swords className="w-4 h-4" />
                <span>Enter Battle Arena</span>
              </button>
              <button
                onClick={() => onNavigate('visualizer')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 text-white font-semibold text-sm border border-surfaceBorder transition-all"
              >
                <Play className="w-4 h-4 text-brand-cyan" />
                <span>Open Visualizer</span>
              </button>
            </div>
          </div>

          {/* User Status Card */}
          <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder/80 bg-surface/80 min-w-[280px] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">Current Rank Tier</span>
                <div className="font-extrabold text-base text-white">Level {level} Coder</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center font-bold text-amber-300 text-sm">
                L{level}
              </div>
            </div>

            {/* XP progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">XP Progress</span>
                <span className="text-brand-cyan font-bold">{xp} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-surfaceLight h-2 rounded-full overflow-hidden border border-surfaceBorder/60">
                <div
                  className="bg-gradient-to-r from-brand-accent via-brand-purple to-brand-cyan h-full transition-all duration-300"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>

            {/* Quick stats mini-row */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surfaceBorder/60 text-center text-xs">
              <div className="bg-surfaceLight/50 p-2 rounded-xl border border-surfaceBorder/40">
                <span className="text-gray-400 block text-[10px]">Battle Wins</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{battleWins}</span>
              </div>
              <div className="bg-surfaceLight/50 p-2 rounded-xl border border-surfaceBorder/40">
                <span className="text-gray-400 block text-[10px]">Quizzes Passed</span>
                <span className="font-bold text-brand-purple font-mono text-sm">{completedQuizzes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Feature Callout: Featured Algorithm Battle */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-rose-500/40 shadow-xl bg-gradient-to-r from-rose-950/20 via-surface to-brand-purple/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">Signature Matchup of the Day</span>
              <h3 className="font-extrabold text-xl text-white">{featuredMatchup.name}</h3>
            </div>
          </div>

          <button
            onClick={() => onNavigate('battle')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-500/30 hover:opacity-95 transition-all"
          >
            <span>Launch Battle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {featuredMatchup.description} Compare comparisons, swaps, and microsecond benchmarks side-by-side with synchronized step controls.
        </p>
      </div>

      {/* Algorithm Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-cyan" />
          <span>Algorithm Domains</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALGORITHM_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || BarChart2;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('visualizer', cat.id)}
                className="glass-panel p-5 rounded-2xl border border-surfaceBorder/70 hover:border-brand-purple/50 cursor-pointer group transition-all duration-200 hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-surfaceLight group-hover:bg-brand-purple/20 border border-surfaceBorder/80 group-hover:border-brand-purple/40 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-brand-cyan group-hover:text-brand-purple" />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white">
                    {cat.count} Algos
                  </span>
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-brand-cyan transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cat.id === 'sorting' && 'Bubble, Selection, Insertion, Merge, Quick, Heap.'}
                  {cat.id === 'searching' && 'Linear Search & Binary Search on sorted intervals.'}
                  {cat.id === 'graph' && 'BFS, DFS, Dijkstra, and A* Shortest Path.'}
                  {cat.id === 'dynamic-programming' && 'Fibonacci, 0/1 Knapsack, and LCS tables.'}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-purple group-hover:text-brand-cyan mt-4">
                  <span>Explore domain</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launchpad & Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Algorithms */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder/60">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-purple" />
              <span>Quick Launch Algorithms</span>
            </h3>
            <span className="text-xs text-gray-500 font-mono">One-click visualizer</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickAlgorithms.map((algo) => (
              <div
                key={algo.id}
                onClick={() => onNavigate('visualizer', null, algo.id)}
                className="bg-surfaceLight/50 hover:bg-surfaceLight/90 border border-surfaceBorder/60 hover:border-brand-cyan/40 p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white group-hover:text-brand-cyan transition-colors">
                      {algo.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-surfaceBorder text-gray-400">
                      {algo.tag}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 mt-0.5 block">
                    Avg: {algo.complexity}
                  </span>
                </div>
                <Play className="w-4 h-4 text-gray-500 group-hover:text-brand-cyan group-hover:scale-110 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Academy Progress Card */}
        <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Learning Progress</span>
            </div>
            <h4 className="font-bold text-base text-white">Algorithms Academy</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complete theoretical modules and pass quizzes to gain XP and climb the leaderboard.
            </p>

            <div className="p-3 bg-surfaceLight/60 rounded-xl border border-surfaceBorder/60 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-300">Modules Completed</span>
                <span className="text-emerald-400 font-mono">{completedQuizzes.length} / 15</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-surfaceBorder/50">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(completedQuizzes.length / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('learn')}
            className="w-full py-2.5 rounded-xl bg-brand-accent hover:bg-brand-purple text-white font-semibold text-xs shadow-md shadow-brand-purple/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
