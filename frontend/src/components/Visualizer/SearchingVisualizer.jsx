import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, ArrowDown } from 'lucide-react';

export function SearchingVisualizer({ step }) {
  if (!step || !step.array) return null;

  const {
    array,
    target,
    currentIndex = -1,
    foundIndex = -1,
    comparing = [],
    checkedIndices = [],
    discardedIndices = [],
    low,
    high,
    mid
  } = step;

  const isBinarySearch = low !== undefined && high !== undefined;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-surface/80 rounded-2xl border border-surfaceBorder/60 space-y-6">
      {/* Target status header */}
      <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-surfaceLight/80 border border-surfaceBorder/80">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs text-gray-400">Target Value:</span>
          <span className="text-base font-extrabold text-brand-cyan font-mono">{target}</span>
        </div>
        <div className="w-px h-5 bg-gray-700" />
        <div className="text-xs">
          {foundIndex !== -1 ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Found at index {foundIndex}!
            </span>
          ) : (
            <span className="text-gray-400">
              Searching...
            </span>
          )}
        </div>
      </div>

      {/* Tiles container */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-full overflow-x-auto py-4 px-2">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx) || currentIndex === idx;
          const isFound = foundIndex === idx;
          const isChecked = checkedIndices.includes(idx);
          const isDiscarded = discardedIndices.includes(idx);
          const isLow = isBinarySearch && low === idx;
          const isHigh = isBinarySearch && high === idx;
          const isMid = isBinarySearch && mid === idx;

          let tileColor = 'bg-surfaceLight/90 border-surfaceBorder/80 text-gray-200';

          if (isFound) {
            tileColor = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/30 scale-110';
          } else if (isComparing) {
            tileColor = 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/40 scale-105';
          } else if (isDiscarded) {
            tileColor = 'bg-gray-900/40 border-gray-800 text-gray-600 opacity-40';
          } else if (isChecked) {
            tileColor = 'bg-surfaceLight/40 border-gray-700 text-gray-400';
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 relative">
              {/* Pointer labels for Binary Search */}
              <div className="h-5 flex items-center justify-center">
                {isMid && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
                    MID
                  </span>
                )}
                {isLow && !isMid && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                    LOW
                  </span>
                )}
                {isHigh && !isMid && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/40">
                    HIGH
                  </span>
                )}
              </div>

              {/* Number Card */}
              <motion.div
                animate={{
                  scale: isComparing || isFound ? 1.08 : 1,
                  y: isComparing ? -4 : 0
                }}
                transition={{ duration: 0.15 }}
                className={`w-12 h-14 rounded-xl border flex flex-col items-center justify-center transition-colors font-mono font-bold text-sm ${tileColor}`}
              >
                <span>{value}</span>
              </motion.div>

              {/* Index number */}
              <span className="text-[10px] font-mono text-gray-500">{idx}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
