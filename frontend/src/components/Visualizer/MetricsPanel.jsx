import React from 'react';
import { Activity, GitCompare, RefreshCw, Code2, Info } from 'lucide-react';

export function MetricsPanel({ step, algorithm }) {
  if (!step) return null;

  const { metrics = { comparisons: 0, swaps: 0, operations: 0 }, description = '', codeLine = 1 } = step;
  const pseudocode = algorithm?.pseudocode || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Metrics Counters & Description Card */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-lg space-y-4">
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surfaceLight/70 border border-surfaceBorder/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Comparisons</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">
              {metrics.comparisons}
            </span>
          </div>

          <div className="bg-surfaceLight/70 border border-surfaceBorder/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Swaps / Writes</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">
              {metrics.swaps}
            </span>
          </div>

          <div className="bg-surfaceLight/70 border border-surfaceBorder/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs text-brand-cyan font-medium mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Operations</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">
              {metrics.operations}
            </span>
          </div>
        </div>

        {/* Narrative Step Description */}
        <div className="bg-surfaceLight/40 border border-surfaceBorder/60 rounded-xl p-3.5 flex items-start gap-3">
          <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Operation Narrative</span>
            <p className="text-sm text-gray-200 font-medium mt-0.5 leading-relaxed">
              {description || 'Ready to execute. Click Play or Step Forward.'}
            </p>
          </div>
        </div>

        {/* Theoretical Complexities */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surfaceBorder/40 text-xs text-gray-400">
          <div>
            Time Complexity: <span className="font-mono text-brand-cyan font-bold">{algorithm?.averageTime || 'O(n)'}</span>
          </div>
          <div>
            Space Complexity: <span className="font-mono text-brand-purple font-bold">{algorithm?.space || 'O(1)'}</span>
          </div>
          {algorithm?.stable !== undefined && (
            <div>
              Stability: <span className={`font-semibold ${algorithm.stable ? 'text-emerald-400' : 'text-amber-400'}`}>
                {algorithm.stable ? 'Stable' : 'Unstable'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Live Pseudocode Line-by-Line Viewer */}
      <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder/60">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
            <Code2 className="w-4 h-4 text-brand-cyan" />
            <span>Active Pseudocode</span>
          </div>
          <span className="text-[11px] font-mono text-gray-500">Line {codeLine}</span>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto space-y-1 font-mono text-xs">
          {pseudocode.map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrentLine = codeLine === lineNum;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isCurrentLine
                    ? 'bg-brand-purple/20 text-white border-l-4 border-brand-purple shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="text-gray-600 text-[10px] w-4 text-right select-none">{lineNum}</span>
                <span className="whitespace-pre overflow-x-auto">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
