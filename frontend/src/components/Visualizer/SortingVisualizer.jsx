import React from 'react';
import { motion } from 'framer-motion';

export function SortingVisualizer({ step, maxVal = 100 }) {
  if (!step || !step.array) return null;

  const { array, comparing = [], swapped = [], sortedIndices = [], activeIndices = [] } = step;
  const highest = Math.max(...array, 10);

  return (
    <div className="w-full h-80 flex items-end justify-center gap-1.5 sm:gap-2 px-4 pb-6 pt-12 relative overflow-hidden bg-surface/80 rounded-2xl border border-surfaceBorder/60 shadow-inner">
      {/* Background grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {array.map((value, idx) => {
        const isComparing = comparing.includes(idx);
        const isSwapped = swapped.includes(idx);
        const isSorted = sortedIndices.includes(idx);
        const isActive = activeIndices.includes(idx);

        // Calculate height percentage
        const heightPercent = Math.max((value / highest) * 85, 8);

        // Color theme depending on state
        let barColor = 'from-indigo-600 via-indigo-500 to-brand-purple'; // default
        let borderGlow = 'border-transparent';
        let badgeColor = 'text-gray-400';

        if (isSorted) {
          barColor = 'from-emerald-600 via-emerald-500 to-teal-400';
          borderGlow = 'border-emerald-400 shadow-md shadow-emerald-500/30';
          badgeColor = 'text-emerald-400 font-bold';
        } else if (isSwapped) {
          barColor = 'from-rose-600 via-rose-500 to-pink-500 animate-pulse';
          borderGlow = 'border-rose-400 shadow-lg shadow-rose-500/50 scale-105';
          badgeColor = 'text-rose-300 font-bold';
        } else if (isComparing) {
          barColor = 'from-amber-500 via-amber-400 to-yellow-300';
          borderGlow = 'border-amber-300 shadow-lg shadow-amber-400/50 scale-105';
          badgeColor = 'text-amber-300 font-bold';
        } else if (isActive) {
          barColor = 'from-cyan-500 via-sky-400 to-blue-500';
          borderGlow = 'border-cyan-300 shadow-md shadow-cyan-400/40';
          badgeColor = 'text-cyan-300 font-bold';
        }

        return (
          <div
            key={idx}
            className="flex-1 max-w-[42px] flex flex-col items-center justify-end h-full relative group transition-all duration-150"
          >
            {/* Value label on top of bar */}
            <span
              className={`text-[11px] font-mono mb-1 transition-all ${badgeColor} ${
                isComparing || isSwapped ? 'scale-125' : ''
              }`}
            >
              {value}
            </span>

            {/* Visual Bar */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ height: `${heightPercent}%` }}
              className={`w-full rounded-t-lg bg-gradient-to-t ${barColor} border ${borderGlow} transition-colors duration-150 relative`}
            >
              {/* Subtle top shine */}
              <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-lg" />
            </motion.div>

            {/* Index label below bar */}
            <span className="text-[10px] font-mono text-gray-500 mt-1 select-none">
              {idx}
            </span>
          </div>
        );
      })}
    </div>
  );
}
