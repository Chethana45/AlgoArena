import React from 'react';
import { motion } from 'framer-motion';

export function DPVisualizer({ algoId, step }) {
  if (!step) return null;

  // 1. Fibonacci
  if (algoId === 'fibonacci' && step.dpArray) {
    const { dpArray, currentIdx, depIndices = [] } = step;

    return (
      <div className="w-full flex flex-col items-center p-6 bg-surface/80 rounded-2xl border border-surfaceBorder/60 space-y-6">
        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-300">Fibonacci 1D Memoization Table</h4>
          <p className="text-xs text-gray-500 font-mono mt-0.5">F(n) = F(n-1) + F(n-2)</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto py-2">
          {dpArray.map((val, idx) => {
            const isCurrent = currentIdx === idx;
            const isDep = depIndices.includes(idx);
            const isFilled = val !== null;

            let cardStyle = 'bg-surfaceLight/60 border-surfaceBorder/70 text-gray-500';
            if (isCurrent) {
              cardStyle = 'bg-brand-purple/20 border-brand-purple text-brand-purple font-bold shadow-lg shadow-brand-purple/30 scale-110';
            } else if (isDep) {
              cardStyle = 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold shadow-md shadow-brand-cyan/30';
            } else if (isFilled) {
              cardStyle = 'bg-surfaceLight border-surfaceBorder text-gray-200';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-gray-400">F({idx})</span>
                <motion.div
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`w-12 h-14 rounded-xl border flex items-center justify-center font-mono font-bold text-sm transition-all ${cardStyle}`}
                >
                  {isFilled ? val : '?'}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. 0/1 Knapsack
  if (algoId === 'knapsack' && step.table) {
    const { table, weights, values, currentRow, currentCol, depCells = [], selectedItems = [] } = step;

    return (
      <div className="w-full flex flex-col items-center p-4 bg-surface/80 rounded-2xl border border-surfaceBorder/60 space-y-4 overflow-x-auto">
        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-300">0/1 Knapsack 2D Dynamic Programming Table</h4>
          <p className="text-xs text-gray-500 font-mono mt-0.5">dp[i][w] = max(val + dp[i-1][w-wt], dp[i-1][w])</p>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="p-2 border border-surfaceBorder/60 text-gray-500 bg-surface">Item (wt, val)</th>
                {table[0].map((_, cap) => (
                  <th key={cap} className="p-2 border border-surfaceBorder/60 text-gray-400 bg-surface">
                    W={cap}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, rIdx) => {
                const itemLabel = rIdx === 0 ? 'Base 0' : `Item ${rIdx} (${weights[rIdx - 1]}kg, $${values[rIdx - 1]})`;
                const isSelected = selectedItems.includes(rIdx - 1);

                return (
                  <tr key={rIdx} className={isSelected ? 'bg-emerald-500/10' : ''}>
                    <td className="p-2 border border-surfaceBorder/60 text-gray-300 font-medium whitespace-nowrap bg-surface">
                      {itemLabel}
                    </td>
                    {row.map((val, cIdx) => {
                      const isCurrent = currentRow === rIdx && currentCol === cIdx;
                      const isDep = depCells.some(d => d.row === rIdx && d.col === cIdx);

                      let cellColor = 'text-gray-300 bg-surfaceLight/30';
                      if (isCurrent) {
                        cellColor = 'bg-brand-purple/30 border-2 border-brand-purple text-white font-extrabold shadow-md shadow-brand-purple/40';
                      } else if (isDep) {
                        cellColor = 'bg-brand-cyan/20 border border-brand-cyan text-brand-cyan font-bold';
                      }

                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 border border-surfaceBorder/60 text-center transition-all min-w-[38px] ${cellColor}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. LCS
  if (algoId === 'lcs' && step.table) {
    const { table, s1, s2, currentRow, currentCol, depCells = [], lcsResult } = step;

    return (
      <div className="w-full flex flex-col items-center p-4 bg-surface/80 rounded-2xl border border-surfaceBorder/60 space-y-4 overflow-x-auto">
        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-300">Longest Common Subsequence DP Table</h4>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            s1 = "{s1}", s2 = "{s2}" {lcsResult ? `➔ LCS: "${lcsResult}"` : ''}
          </p>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="p-2 border border-surfaceBorder/60 text-gray-500 bg-surface">s1 \ s2</th>
                <th className="p-2 border border-surfaceBorder/60 text-gray-400 bg-surface">ε</th>
                {s2.split('').map((char, idx) => (
                  <th key={idx} className="p-2 border border-surfaceBorder/60 text-brand-cyan bg-surface">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, rIdx) => {
                const rowChar = rIdx === 0 ? 'ε' : s1[rIdx - 1];

                return (
                  <tr key={rIdx}>
                    <td className="p-2 border border-surfaceBorder/60 text-brand-purple font-medium text-center bg-surface">
                      {rowChar}
                    </td>
                    {row.map((val, cIdx) => {
                      const isCurrent = currentRow === rIdx && currentCol === cIdx;
                      const isDep = depCells.some(d => d.row === rIdx && d.col === cIdx);

                      let cellColor = 'text-gray-300 bg-surfaceLight/30';
                      if (isCurrent) {
                        cellColor = 'bg-brand-purple/30 border-2 border-brand-purple text-white font-extrabold shadow-md shadow-brand-purple/40';
                      } else if (isDep) {
                        cellColor = 'bg-brand-cyan/20 border border-brand-cyan text-brand-cyan font-bold';
                      }

                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 border border-surfaceBorder/60 text-center transition-all min-w-[36px] ${cellColor}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
