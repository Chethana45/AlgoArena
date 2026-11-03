import React, { useState } from 'react';
import { Flag, Compass } from 'lucide-react';
import { GRID_ROWS, GRID_COLS } from '../../algorithms/graph';

export function GraphVisualizer({
  step,
  startNode,
  targetNode,
  walls,
  onToggleWall
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const visitedSet = new Set(step?.visitedNodes || []);
  const pathSet = new Set(step?.path?.map(p => p.key) || []);
  const frontierSet = new Set(step?.frontier || []);
  const currentKey = step?.current ? `${step.current.row},${step.current.col}` : null;

  const startKey = `${startNode.row},${startNode.col}`;
  const targetKey = `${targetNode.row},${targetNode.col}`;

  const handleMouseEnter = (row, col) => {
    if (isMouseDown) {
      onToggleWall(row, col);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4 bg-surface/80 rounded-2xl border border-surfaceBorder/60 space-y-4">
      {/* Legend bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-400" />
          <span>Start Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-400" />
          <span>Target Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-gray-900 border border-gray-700" />
          <span>Wall Obstacle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-cyan-600/60 border border-cyan-400" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-300 shadow-sm" />
          <span>Shortest Path</span>
        </div>
      </div>

      {/* Grid Container */}
      <div
        className="inline-grid select-none gap-[2px] p-2 bg-surfaceLight/80 rounded-xl border border-surfaceBorder/60 shadow-xl overflow-x-auto max-w-full"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(18px, 24px))`
        }}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {Array.from({ length: GRID_ROWS }).map((_, r) =>
          Array.from({ length: GRID_COLS }).map((_, c) => {
            const key = `${r},${c}`;
            const isStart = key === startKey;
            const isTarget = key === targetKey;
            const isWall = walls.has(key);
            const isPath = pathSet.has(key);
            const isCurrent = key === currentKey;
            const isVisited = visitedSet.has(key);
            const isFrontier = frontierSet.has(key);

            let cellClass = 'bg-surface hover:bg-surfaceLight/90';

            if (isStart) {
              cellClass = 'bg-emerald-500 shadow-md shadow-emerald-500/50 text-white font-bold';
            } else if (isTarget) {
              cellClass = 'bg-rose-500 shadow-md shadow-rose-500/50 text-white font-bold animate-pulse';
            } else if (isPath) {
              cellClass = 'bg-amber-400 shadow-md shadow-amber-400/60 scale-105 z-10 transition-transform';
            } else if (isCurrent) {
              cellClass = 'bg-white shadow-lg shadow-white/60 scale-110 z-10';
            } else if (isVisited) {
              cellClass = 'bg-cyan-600/70 border-cyan-500/50 transition-colors duration-200';
            } else if (isFrontier) {
              cellClass = 'bg-indigo-600/40 border border-indigo-400/60';
            } else if (isWall) {
              cellClass = 'bg-gray-950 border-gray-900 shadow-inner';
            }

            return (
              <div
                key={key}
                onMouseDown={() => onToggleWall(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                className={`w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] rounded-[3px] border border-surfaceBorder/30 cursor-pointer flex items-center justify-center transition-all text-[10px] ${cellClass}`}
              >
                {isStart && <Flag className="w-3 h-3 text-white fill-white" />}
                {isTarget && <Compass className="w-3 h-3 text-white" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
