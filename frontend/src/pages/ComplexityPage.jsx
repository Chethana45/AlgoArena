import React, { useState } from 'react';
import { ALL_ALGORITHMS } from '../algorithms';
import {
  TrendingUp,
  HelpCircle,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function ComplexityPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [inputN, setInputN] = useState(25);

  // Generate Big-O growth curves dataset up to inputN
  const chartData = [];
  const stepSize = Math.max(1, Math.floor(inputN / 15));
  for (let n = 1; n <= inputN; n += stepSize) {
    chartData.push({
      n,
      'O(1)': 1,
      'O(log n)': Math.round(Math.log2(n) * 10) / 10,
      'O(n)': n,
      'O(n log n)': Math.round(n * Math.log2(n) * 10) / 10,
      'O(n²)': n * n,
      'O(2ⁿ)': n <= 16 ? Math.pow(2, n) : null // cap to avoid runaway graph
    });
  }

  const algorithmsList = Object.values(ALL_ALGORITHMS).filter(
    (a) => filterCategory === 'all' || a.category === filterCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-accent to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Complexity Analyzer & Big-O Guide
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Demystifying time and space complexity with interactive asymptotic growth curves.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Big-O Growth Curves Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Interactive Big-O Scalability Curves</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Observe how operation counts diverge as input dataset size n scales.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surfaceLight/80 px-4 py-2 rounded-xl border border-surfaceBorder/60">
            <span className="text-xs text-gray-300 font-medium">Input Size (n):</span>
            <input
              type="range"
              min="5"
              max="40"
              value={inputN}
              onChange={(e) => setInputN(Number(e.target.value))}
              className="w-28 accent-brand-cyan cursor-pointer h-1.5 bg-gray-700 rounded-lg"
            />
            <span className="font-mono text-brand-cyan font-bold text-sm w-6 text-right">
              {inputN}
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="n" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5, fill: '#6B7280', fontSize: 11 }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderColor: '#374151',
                  borderRadius: '0.75rem',
                  color: '#F3F4F6',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
              <Line type="monotone" dataKey="O(1)" stroke="#10B981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="O(log n)" stroke="#06B6D4" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="O(n)" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="O(n log n)" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="O(n²)" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="O(2ⁿ)" stroke="#F43F5E" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Educational Concept Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-brand-cyan">
            <Layers className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">Big-O vs Big-Ω vs Big-Θ</h4>
          </div>
          <ul className="text-xs text-gray-300 space-y-2 leading-relaxed pt-1">
            <li>
              <strong className="text-brand-cyan font-mono">O(g(n)) [Big-O]:</strong> Upper bound. Guarantees the algorithm will not take longer than this worst-case scenario.
            </li>
            <li>
              <strong className="text-emerald-400 font-mono">Ω(g(n)) [Big-Omega]:</strong> Lower bound. The absolute fastest best-case scenario.
            </li>
            <li>
              <strong className="text-purple-400 font-mono">Θ(g(n)) [Big-Theta]:</strong> Tight bound. When upper bound and lower bound match asymptotically.
            </li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-brand-purple">
            <Cpu className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">4 Rules of Complexity</h4>
          </div>
          <ul className="text-xs text-gray-300 space-y-2 leading-relaxed pt-1">
            <li>
              <strong>1. Drop Constants:</strong> O(2n) simplifies directly to O(n).
            </li>
            <li>
              <strong>2. Drop Non-Dominants:</strong> O(n² + n + 10) simplifies to O(n²).
            </li>
            <li>
              <strong>3. Add Consecutive Steps:</strong> Loop 1 + Loop 2 = O(A + B).
            </li>
            <li>
              <strong>4. Multiply Nested Steps:</strong> Outer loop of size n * Inner loop of size m = O(n * m).
            </li>
          </ul>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <HelpCircle className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">Space-Time Tradeoff</h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed pt-1">
            Algorithms frequently trade memory consumption to achieve superior speeds:
          </p>
          <div className="p-2.5 rounded-xl bg-surfaceLight/60 border border-surfaceBorder/60 text-xs text-gray-300 space-y-1">
            <p>
              • <strong>Memoization:</strong> Dynamic programming tables cache subproblems, cutting runtime from O(2ⁿ) down to O(n) by spending O(n) RAM.
            </p>
            <p>
              • <strong>Hash Maps:</strong> Enable O(1) searches by allocating bucket arrays in memory.
            </p>
          </div>
        </div>
      </div>

      {/* Master Comparison Matrix Table */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-cyan" />
            <span>Master Complexity Comparison Matrix</span>
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'sorting', 'searching', 'graph', 'dynamic-programming'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-brand-accent text-white shadow'
                    : 'bg-surfaceLight/80 text-gray-400 hover:text-white'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surfaceBorder/80 text-gray-400 bg-surfaceLight/40">
                <th className="p-3">Algorithm</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-emerald-400">Best Case</th>
                <th className="p-3 text-brand-cyan">Average Case</th>
                <th className="p-3 text-rose-400">Worst Case</th>
                <th className="p-3 text-brand-purple">Space Complexity</th>
                <th className="p-3 text-center">Stability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceBorder/40">
              {algorithmsList.map((algo) => (
                <tr key={algo.id} className="hover:bg-surfaceLight/30 transition-colors">
                  <td className="p-3 font-sans font-bold text-white whitespace-nowrap">
                    {algo.name}
                  </td>
                  <td className="p-3 capitalize font-sans text-gray-400">
                    {algo.category.replace('-', ' ')}
                  </td>
                  <td className="p-3 text-emerald-400 font-bold whitespace-nowrap">
                    {algo.bestTime || 'O(1)'}
                  </td>
                  <td className="p-3 text-brand-cyan font-bold whitespace-nowrap">
                    {algo.averageTime || 'O(n)'}
                  </td>
                  <td className="p-3 text-rose-400 font-bold whitespace-nowrap">
                    {algo.worstTime || 'O(n)'}
                  </td>
                  <td className="p-3 text-brand-purple font-bold whitespace-nowrap">
                    {algo.space || 'O(1)'}
                  </td>
                  <td className="p-3 text-center">
                    {algo.stable !== undefined ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                        algo.stable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {algo.stable ? 'Yes' : 'No'}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
