import React, { useState, useEffect, useRef } from 'react';
import {
  ALL_ALGORITHMS,
  ALGORITHM_CATEGORIES,
  generateDataset,
  parseCustomInput
} from '../algorithms';
import { GRID_ROWS, GRID_COLS } from '../algorithms/graph';
import { ControlsBar } from '../components/Visualizer/ControlsBar';
import { SortingVisualizer } from '../components/Visualizer/SortingVisualizer';
import { SearchingVisualizer } from '../components/Visualizer/SearchingVisualizer';
import { GraphVisualizer } from '../components/Visualizer/GraphVisualizer';
import { DPVisualizer } from '../components/Visualizer/DPVisualizer';
import { MetricsPanel } from '../components/Visualizer/MetricsPanel';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VisualizerPage({ initialAlgo = 'bubbleSort' }) {
  const { user, toggleFavorite, addXP } = useAuth();

  // State
  const [selectedAlgoId, setSelectedAlgoId] = useState(initialAlgo);
  const [activeCategory, setActiveCategory] = useState(ALL_ALGORITHMS[initialAlgo]?.category || 'sorting');

  // Datasets
  const [datasetType, setDatasetType] = useState('random');
  const [arraySize, setArraySize] = useState(15);
  const [customInput, setCustomInput] = useState('');
  const [currentArray, setCurrentArray] = useState(() => generateDataset('random', 15));
  const [searchTarget, setSearchTarget] = useState(42);

  // Graph state
  const [startNode, setStartNode] = useState({ row: 7, col: 4 });
  const [targetNode, setTargetNode] = useState({ row: 7, col: 20 });
  const [walls, setWalls] = useState(() => new Set());

  // Execution Steps & Playback
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(250); // ms per step

  const timerRef = useRef(null);

  const algorithm = ALL_ALGORITHMS[selectedAlgoId];
  const isFavorite = user?.favoriteAlgorithms?.includes(selectedAlgoId);

  // Build steps when algorithm or data changes
  const buildSteps = () => {
    setIsPlaying(false);
    if (!algorithm) return;

    let generatedSteps = [];
    if (activeCategory === 'sorting') {
      generatedSteps = algorithm.generator(currentArray);
    } else if (activeCategory === 'searching') {
      generatedSteps = algorithm.generator(currentArray, searchTarget);
    } else if (activeCategory === 'graph') {
      generatedSteps = algorithm.generator(walls, startNode, targetNode, GRID_ROWS, GRID_COLS);
    } else if (activeCategory === 'dynamic-programming') {
      generatedSteps = algorithm.generator();
    }

    setSteps(generatedSteps);
    setCurrentStepIdx(0);
  };

  // Re-generate on algo, array, target, or category change
  useEffect(() => {
    buildSteps();
  }, [selectedAlgoId, currentArray, searchTarget, walls]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            addXP(10); // small XP reward for watching full execution
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((p) => Math.max(0, p - 1));
      } else if (e.key === 'r' || e.key === 'R') {
        setIsPlaying(false);
        setCurrentStepIdx(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length]);

  // Dataset helpers
  const handleDatasetChange = (type) => {
    setDatasetType(type);
    const newArr = generateDataset(type, arraySize);
    setCurrentArray(newArr);
    if (type === 'random' && newArr.length > 0) {
      setSearchTarget(newArr[Math.floor(newArr.length / 2)]);
    }
  };

  const handleSizeChange = (newSize) => {
    setArraySize(newSize);
    const newArr = generateDataset(datasetType, newSize);
    setCurrentArray(newArr);
  };

  const handleApplyCustomInput = () => {
    const parsed = parseCustomInput(customInput, arraySize);
    setArraySize(parsed.length);
    setCurrentArray(parsed);
    setDatasetType('custom');
  };

  // Graph walls helpers
  const handleToggleWall = (r, c) => {
    if (isPlaying) return;
    const key = `${r},${c}`;
    const startKey = `${startNode.row},${startNode.col}`;
    const targetKey = `${targetNode.row},${targetNode.col}`;
    if (key === startKey || key === targetKey) return;

    setWalls((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleGenerateMaze = () => {
    if (isPlaying) return;
    const newWalls = new Set();
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const key = `${r},${c}`;
        const isStart = r === startNode.row && c === startNode.col;
        const isTarget = r === targetNode.row && c === targetNode.col;
        if (!isStart && !isTarget && Math.random() < 0.28) {
          newWalls.add(key);
        }
      }
    }
    setWalls(newWalls);
  };

  const handleClearWalls = () => {
    if (isPlaying) return;
    setWalls(new Set());
  };

  // Category change helper
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    const firstAlgo = Object.values(ALL_ALGORITHMS).find(a => a.category === catId);
    if (firstAlgo) setSelectedAlgoId(firstAlgo.id);
  };

  const currentStep = steps[currentStepIdx] || steps[0] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header: Category Tabs & Algorithm Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-surfaceBorder/70 shadow-lg">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ALGORITHM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-brand-accent to-brand-purple text-white shadow-md shadow-brand-purple/30'
                  : 'bg-surfaceLight/60 text-gray-400 hover:text-white hover:bg-surfaceLight'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Algorithm Dropdown & Favorite Star */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-400 hidden sm:inline">Algorithm:</label>
          <select
            value={selectedAlgoId}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedAlgoId(newId);
              setActiveCategory(ALL_ALGORITHMS[newId]?.category || 'sorting');
            }}
            className="bg-surfaceLight border border-surfaceBorder rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-brand-purple"
          >
            {Object.values(ALL_ALGORITHMS)
              .filter((a) => a.category === activeCategory)
              .map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
          </select>

          <button
            onClick={() => toggleFavorite(selectedAlgoId)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-400/40 shadow-sm'
                : 'bg-surfaceLight/80 text-gray-400 border-surfaceBorder hover:text-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <ControlsBar
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIdx(0);
        }}
        onNext={() => {
          setIsPlaying(false);
          setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1));
        }}
        onPrev={() => {
          setIsPlaying(false);
          setCurrentStepIdx((p) => Math.max(0, p - 1));
        }}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIdx}
        totalSteps={steps.length}
        category={activeCategory}
        datasetType={datasetType}
        onDatasetChange={handleDatasetChange}
        arraySize={arraySize}
        onSizeChange={handleSizeChange}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        onApplyCustomInput={handleApplyCustomInput}
        searchTarget={searchTarget}
        onSearchTargetChange={setSearchTarget}
        onGenerateMaze={handleGenerateMaze}
        onClearWalls={handleClearWalls}
      />

      {/* Main Visualization Workspace */}
      <div className="relative">
        {activeCategory === 'sorting' && (
          <SortingVisualizer step={currentStep} />
        )}
        {activeCategory === 'searching' && (
          <SearchingVisualizer step={currentStep} />
        )}
        {activeCategory === 'graph' && (
          <GraphVisualizer
            step={currentStep}
            startNode={startNode}
            targetNode={targetNode}
            walls={walls}
            onToggleWall={handleToggleWall}
          />
        )}
        {activeCategory === 'dynamic-programming' && (
          <DPVisualizer algoId={selectedAlgoId} step={currentStep} />
        )}
      </div>

      {/* Operation Metrics & Pseudocode Panel */}
      <MetricsPanel step={currentStep} algorithm={algorithm} />
    </div>
  );
}
