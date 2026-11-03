import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Sparkles,
  Shuffle,
  Grid,
  Search,
  Check
} from 'lucide-react';

export function ControlsBar({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrev,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  category,
  datasetType,
  onDatasetChange,
  arraySize,
  onSizeChange,
  customInput,
  onCustomInputChange,
  onApplyCustomInput,
  searchTarget,
  onSearchTargetChange,
  onGenerateMaze,
  onClearWalls,
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
      {/* Top row: Playback actions & Step status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onPrev}
            disabled={isPlaying || currentStep <= 0}
            className="p-2.5 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 disabled:opacity-40 disabled:cursor-not-allowed border border-surfaceBorder/80 text-gray-300 hover:text-white transition-all"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-lg shadow-amber-500/25 transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={currentStep >= totalSteps - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-accent via-brand-purple to-brand-cyan hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-brand-purple/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{currentStep === 0 ? 'Start' : 'Resume'}</span>
            </button>
          )}

          {/* Step Forward */}
          <button
            onClick={onNext}
            disabled={isPlaying || currentStep >= totalSteps - 1}
            className="p-2.5 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 disabled:opacity-40 disabled:cursor-not-allowed border border-surfaceBorder/80 text-gray-300 hover:text-white transition-all"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-surfaceLight hover:bg-rose-500/20 hover:text-rose-400 border border-surfaceBorder/80 text-gray-300 transition-all ml-1"
            title="Reset to Initial State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress scrubber & indicators */}
        <div className="flex items-center gap-3 min-w-[200px] flex-1 max-w-md">
          <span className="text-xs font-mono text-gray-400 whitespace-nowrap">
            Step <span className="text-brand-cyan font-bold">{currentStep + 1}</span> / {totalSteps || 1}
          </span>
          <div className="w-full bg-surfaceLight h-2 rounded-full overflow-hidden border border-surfaceBorder/50">
            <div
              className="bg-gradient-to-r from-brand-accent via-brand-purple to-brand-cyan h-full transition-all duration-150"
              style={{
                width: `${totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 bg-surfaceLight/60 px-3 py-1.5 rounded-xl border border-surfaceBorder/60">
          <Sliders className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-300 font-medium">Speed</span>
          <input
            type="range"
            min="10"
            max="800"
            step="10"
            value={810 - speed} // invert so higher slider = faster animation
            onChange={(e) => onSpeedChange(810 - Number(e.target.value))}
            className="w-24 accent-brand-purple cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
          <span className="text-[11px] font-mono text-brand-purple font-semibold w-8 text-right">
            {Math.round((800 / speed) * 10) / 10}x
          </span>
        </div>
      </div>

      {/* Bottom row: Category-specific Dataset Controls */}
      <div className="pt-3 border-t border-surfaceBorder/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Sorting & Searching datasets */}
        {(category === 'sorting' || category === 'searching') && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 font-medium flex items-center gap-1">
                <Shuffle className="w-3.5 h-3.5" /> Preset:
              </span>
              {[
                { id: 'random', label: 'Random' },
                { id: 'sorted', label: 'Sorted' },
                { id: 'reverse', label: 'Reverse' },
                { id: 'nearlySorted', label: 'Nearly Sorted' },
                { id: 'duplicates', label: 'Duplicates' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onDatasetChange(preset.id)}
                  disabled={isPlaying}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    datasetType === preset.id
                      ? 'bg-brand-accent text-white shadow-sm shadow-brand-accent/30'
                      : 'bg-surfaceLight/80 text-gray-300 hover:text-white hover:bg-surfaceLight'
                  } disabled:opacity-50`}
                >
                  {preset.label}
                </button>
              ))}

              <button
                onClick={() => setShowCustomModal(true)}
                disabled={isPlaying}
                className="px-2.5 py-1 rounded-lg bg-surfaceLight/80 text-brand-cyan hover:bg-brand-cyan/20 border border-brand-cyan/30 font-medium transition-all"
              >
                Custom Array...
              </button>
            </div>

            {/* Array Size Slider */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Size:</span>
              <input
                type="range"
                min="5"
                max="35"
                value={arraySize}
                disabled={isPlaying}
                onChange={(e) => onSizeChange(Number(e.target.value))}
                className="w-20 accent-brand-accent cursor-pointer h-1.5 bg-gray-700 rounded-lg"
              />
              <span className="font-mono text-brand-cyan font-bold">{arraySize}</span>
            </div>

            {/* Target Value Input for Searching */}
            {category === 'searching' && (
              <div className="flex items-center gap-2 bg-surfaceLight/80 px-2.5 py-1 rounded-lg border border-surfaceBorder/60">
                <Search className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="text-gray-400">Target:</span>
                <input
                  type="number"
                  value={searchTarget}
                  disabled={isPlaying}
                  onChange={(e) => onSearchTargetChange(Number(e.target.value))}
                  className="w-16 bg-surface border border-surfaceBorder rounded px-1.5 py-0.5 text-white font-mono text-center focus:outline-none focus:border-brand-cyan"
                />
              </div>
            )}
          </>
        )}

        {/* Graph controls: Maze generation & Clear */}
        {category === 'graph' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Grid Actions:</span>
            <button
              onClick={onGenerateMaze}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surfaceLight text-brand-cyan hover:bg-brand-cyan/20 border border-brand-cyan/30 transition-all font-medium"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Generate Random Maze</span>
            </button>
            <button
              onClick={onClearWalls}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surfaceLight text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all font-medium"
            >
              <span>Clear Walls</span>
            </button>
            <span className="text-gray-500 italic ml-2">Tip: Click or drag on grid to draw/erase walls!</span>
          </div>
        )}

        {/* DP notice */}
        {category === 'dynamic-programming' && (
          <div className="flex items-center gap-2 text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            <span>Watch how the table memoizes overlapping subproblems cell by cell.</span>
          </div>
        )}
      </div>

      {/* Custom Array Entry Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surfaceBorder shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
              <span>Custom Input Array</span>
            </h3>
            <p className="text-xs text-gray-300">
              Enter numbers between 5 and 200 separated by commas or spaces (up to 35 items).
            </p>
            <input
              type="text"
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="e.g. 45, 12, 89, 34, 67, 23, 99, 10"
              className="w-full bg-surfaceLight border border-surfaceBorder rounded-xl p-3 text-white font-mono text-sm focus:outline-none focus:border-brand-purple"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-surfaceLight text-gray-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApplyCustomInput();
                  setShowCustomModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-brand-accent hover:bg-brand-purple text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-purple/30"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Array</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
