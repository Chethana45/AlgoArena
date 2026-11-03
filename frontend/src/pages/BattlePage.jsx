import React, { useState, useEffect, useRef } from 'react';
import {
  SORTING_ALGORITHMS,
  GRAPH_ALGORITHMS,
  generateDataset
} from '../algorithms';
import { GRID_ROWS, GRID_COLS } from '../algorithms/graph';
import { SortingVisualizer } from '../components/Visualizer/SortingVisualizer';
import { GraphVisualizer } from '../components/Visualizer/GraphVisualizer';
import {
  Swords,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Trophy,
  Flame,
  Zap,
  Timer,
  GitCompare,
  RefreshCw,
  Activity,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function BattlePage() {
  const { recordBattle } = useAuth();

  // Mode: sorting or graph
  const [battleType, setBattleType] = useState('sorting'); // 'sorting' | 'graph'

  // Competitor selections
  const [algoAId, setAlgoAId] = useState('quickSort');
  const [algoBId, setAlgoBId] = useState('mergeSort');

  // Input dataset (shared identical seed for fairness)
  const [datasetSize, setDatasetSize] = useState(18);
  const [sharedArray, setSharedArray] = useState(() => generateDataset('random', 18));

  // Graph state for graph battle
  const [startNode] = useState({ row: 7, col: 4 });
  const [targetNode] = useState({ row: 7, col: 20 });
  const [walls] = useState(() => {
    const w = new Set();
    // Add symmetrical maze barriers
    for (let r = 2; r < 12; r++) {
      if (r !== 7) w.add(`${r},12`);
    }
    return w;
  });

  // Step sequences for both
  const [stepsA, setStepsA] = useState([]);
  const [stepsB, setStepsB] = useState([]);

  // Step indices
  const [stepAIdx, setStepAIdx] = useState(0);
  const [stepBIdx, setStepBIdx] = useState(0);

  // Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(120);

  // Measured real-time benchmarks (ms)
  const [benchA, setBenchA] = useState(0);
  const [benchB, setBenchB] = useState(0);

  // Winner calculation
  const [winner, setWinner] = useState(null);

  const timerRef = useRef(null);

  const algoA = battleType === 'sorting' ? SORTING_ALGORITHMS[algoAId] : GRAPH_ALGORITHMS[algoAId];
  const algoB = battleType === 'sorting' ? SORTING_ALGORITHMS[algoBId] : GRAPH_ALGORITHMS[algoBId];

  // Re-run step generation & benchmark
  const prepareBattle = () => {
    setIsPlaying(false);
    setWinner(null);

    let genA, genB;
    if (battleType === 'sorting') {
      // Benchmark A
      const copyA = [...sharedArray];
      const t0 = performance.now();
      genA = algoA.generator(copyA);
      const t1 = performance.now();
      setBenchA(Math.max(0.02, Math.round((t1 - t0) * 100) / 100));

      // Benchmark B
      const copyB = [...sharedArray];
      const t2 = performance.now();
      genB = algoB.generator(copyB);
      const t3 = performance.now();
      setBenchB(Math.max(0.02, Math.round((t3 - t2) * 100) / 100));
    } else {
      const t0 = performance.now();
      genA = algoA.generator(walls, startNode, targetNode, GRID_ROWS, GRID_COLS);
      const t1 = performance.now();
      setBenchA(Math.max(0.02, Math.round((t1 - t0) * 100) / 100));

      const t2 = performance.now();
      genB = algoB.generator(walls, startNode, targetNode, GRID_ROWS, GRID_COLS);
      const t3 = performance.now();
      setBenchB(Math.max(0.02, Math.round((t3 - t2) * 100) / 100));
    }

    setStepsA(genA);
    setStepsB(genB);
    setStepAIdx(0);
    setStepBIdx(0);
  };

  useEffect(() => {
    prepareBattle();
  }, [battleType, algoAId, algoBId, sharedArray]);

  // Synchronous battle ticker
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        let doneA = false;
        let doneB = false;

        setStepAIdx((prev) => {
          if (prev >= stepsA.length - 1) {
            doneA = true;
            return prev;
          }
          return prev + 1;
        });

        setStepBIdx((prev) => {
          if (prev >= stepsB.length - 1) {
            doneB = true;
            return prev;
          }
          return prev + 1;
        });

        if (doneA && doneB) {
          setIsPlaying(false);
          clearInterval(timerRef.current);
          evaluateWinner();
        }
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, stepsA.length, stepsB.length]);

  const evaluateWinner = () => {
    const finalA = stepsA[stepsA.length - 1]?.metrics || { operations: 0 };
    const finalB = stepsB[stepsB.length - 1]?.metrics || { operations: 0 };

    if (finalA.operations < finalB.operations) {
      setWinner({ name: algoA.name, side: 'A', margin: finalB.operations - finalA.operations });
      recordBattle(true);
    } else if (finalB.operations < finalA.operations) {
      setWinner({ name: algoB.name, side: 'B', margin: finalA.operations - finalB.operations });
      recordBattle(true);
    } else {
      setWinner({ name: 'Draw', side: 'none', margin: 0 });
    }
  };

  const handleShuffleDataset = () => {
    setSharedArray(generateDataset('random', datasetSize));
  };

  const stepA = stepsA[stepAIdx] || stepsA[0] || {};
  const stepB = stepsB[stepBIdx] || stepsB[0] || {};

  const metricsA = stepA.metrics || { comparisons: 0, swaps: 0, operations: 0 };
  const metricsB = stepB.metrics || { comparisons: 0, swaps: 0, operations: 0 };

  const chartData = [
    {
      metric: 'Comparisons',
      [algoA.name]: metricsA.comparisons,
      [algoB.name]: metricsB.comparisons
    },
    {
      metric: 'Swaps / Writes',
      [algoA.name]: metricsA.swaps,
      [algoB.name]: metricsB.swaps
    },
    {
      metric: 'Total Ops',
      [algoA.name]: metricsA.operations,
      [algoB.name]: metricsB.operations
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Preset Matches */}
      <div className="glass-panel p-6 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-brand-purple flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">Algorithm Battle Arena</h1>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-extrabold text-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> LIVE
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Head-to-head algorithm faceoff running against an identical dataset in lockstep.
              </p>
            </div>
          </div>

          {/* Mode Switcher: Sorting vs Graph */}
          <div className="flex items-center bg-surfaceLight p-1 rounded-xl border border-surfaceBorder">
            <button
              onClick={() => {
                setBattleType('sorting');
                setAlgoAId('quickSort');
                setAlgoBId('mergeSort');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                battleType === 'sorting' ? 'bg-brand-accent text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sorting Arena
            </button>
            <button
              onClick={() => {
                setBattleType('graph');
                setAlgoAId('bfs');
                setAlgoBId('dfs');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                battleType === 'graph' ? 'bg-brand-purple text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Graph Arena
            </button>
          </div>
        </div>

        {/* Featured Preset Matchups */}
        <div className="pt-2 border-t border-surfaceBorder/40 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium">Classic Matchups:</span>
          {battleType === 'sorting' ? (
            <>
              <button
                onClick={() => { setAlgoAId('quickSort'); setAlgoBId('mergeSort'); }}
                className="px-2.5 py-1 rounded-lg bg-surfaceLight hover:bg-surfaceLight/80 text-brand-cyan border border-brand-cyan/30"
              >
                Quick Sort vs Merge Sort
              </button>
              <button
                onClick={() => { setAlgoAId('bubbleSort'); setAlgoBId('insertionSort'); }}
                className="px-2.5 py-1 rounded-lg bg-surfaceLight hover:bg-surfaceLight/80 text-amber-300 border border-amber-400/30"
              >
                Bubble Sort vs Insertion Sort
              </button>
              <button
                onClick={() => { setAlgoAId('heapSort'); setAlgoBId('quickSort'); }}
                className="px-2.5 py-1 rounded-lg bg-surfaceLight hover:bg-surfaceLight/80 text-purple-300 border border-purple-400/30"
              >
                Heap Sort vs Quick Sort
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setAlgoAId('bfs'); setAlgoBId('dfs'); }}
                className="px-2.5 py-1 rounded-lg bg-surfaceLight hover:bg-surfaceLight/80 text-brand-cyan border border-brand-cyan/30"
              >
                BFS vs DFS
              </button>
              <button
                onClick={() => { setAlgoAId('dijkstra'); setAlgoBId('astar'); }}
                className="px-2.5 py-1 rounded-lg bg-surfaceLight hover:bg-surfaceLight/80 text-amber-300 border border-amber-400/30"
              >
                Dijkstra vs A* Search
              </button>
            </>
          )}
        </div>
      </div>

      {/* Battle Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-surfaceBorder/70 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Playback actions */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-lg shadow-amber-500/25 transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Match</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              disabled={stepAIdx >= stepsA.length - 1 && stepBIdx >= stepsB.length - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-brand-accent hover:opacity-95 disabled:opacity-40 text-white font-bold shadow-lg shadow-rose-500/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Battle</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsPlaying(false);
              setStepAIdx(0);
              setStepBIdx(0);
              setWinner(null);
            }}
            className="p-2.5 rounded-xl bg-surfaceLight hover:bg-rose-500/20 hover:text-rose-400 border border-surfaceBorder text-gray-300 transition-all"
            title="Reset Battle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setStepAIdx((p) => Math.min(stepsA.length - 1, p + 1));
              setStepBIdx((p) => Math.min(stepsB.length - 1, p + 1));
            }}
            disabled={isPlaying}
            className="p-2.5 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 border border-surfaceBorder text-gray-300 transition-all"
            title="Step Both Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {battleType === 'sorting' && (
            <button
              onClick={handleShuffleDataset}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surfaceLight hover:bg-surfaceLight/80 border border-surfaceBorder text-brand-cyan text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>New Array</span>
            </button>
          )}
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 bg-surfaceLight/60 px-3 py-1.5 rounded-xl border border-surfaceBorder/60 text-xs">
          <span className="text-gray-400 font-medium">Battle Pace:</span>
          <input
            type="range"
            min="20"
            max="400"
            step="10"
            value={420 - speed}
            onChange={(e) => setSpeed(420 - Number(e.target.value))}
            className="w-24 accent-rose-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>
      </div>

      {/* Winner Announcement Banner */}
      {winner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-brand-purple/20 to-brand-accent/20 border-2 border-amber-400/60 shadow-xl flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-extrabold shadow-md shadow-amber-500/40">
              <Trophy className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Winner: {winner.name}!
              </h3>
              <p className="text-xs text-amber-200">
                Outperformed opponent by {winner.margin} fewer operational cycles. XP reward logged!
              </p>
            </div>
          </div>
          <Award className="w-8 h-8 text-amber-400 hidden sm:block animate-bounce" />
        </div>
      )}

      {/* Side-by-Side Arenas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arena Left: Competitor A */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-brand-cyan/40 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
              <span className="text-xs uppercase font-extrabold text-brand-cyan tracking-wider">Side A</span>
            </div>
            <select
              value={algoAId}
              onChange={(e) => setAlgoAId(e.target.value)}
              className="bg-surfaceLight border border-surfaceBorder rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
            >
              {Object.values(battleType === 'sorting' ? SORTING_ALGORITHMS : GRAPH_ALGORITHMS).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Workspace */}
          <div className="min-h-[260px] flex items-center justify-center">
            {battleType === 'sorting' ? (
              <SortingVisualizer step={stepA} />
            ) : (
              <GraphVisualizer
                step={stepA}
                startNode={startNode}
                targetNode={targetNode}
                walls={walls}
                onToggleWall={() => {}}
              />
            )}
          </div>

          {/* Real-time counters */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="bg-surfaceLight/70 p-2.5 rounded-xl border border-surfaceBorder/60">
              <span className="text-gray-400 block text-[10px]">Comparisons</span>
              <span className="font-mono font-bold text-base text-amber-400">{metricsA.comparisons}</span>
            </div>
            <div className="bg-surfaceLight/70 p-2.5 rounded-xl border border-surfaceBorder/60">
              <span className="text-gray-400 block text-[10px]">Swaps / Writes</span>
              <span className="font-mono font-bold text-base text-rose-400">{metricsA.swaps}</span>
            </div>
            <div className="bg-surfaceLight/70 p-2.5 rounded-xl border border-surfaceBorder/60">
              <span className="text-gray-400 block text-[10px]">Total Ops</span>
              <span className="font-mono font-bold text-base text-brand-cyan">{metricsA.operations}</span>
            </div>
          </div>

          {/* Theoretical vs Measured */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 bg-surface/60 p-2.5 rounded-xl border border-surfaceBorder/40">
            <div>
              Theoretical: <span className="font-mono text-white font-semibold">{algoA.averageTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Micro-bench: <strong className="font-mono text-brand-cyan">{benchA} ms</strong></span>
            </div>
          </div>
        </div>

        {/* Arena Right: Competitor B */}
        <div className="glass-panel p-5 rounded-2xl border-2 border-brand-purple/40 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-surfaceBorder/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple animate-pulse" />
              <span className="text-xs uppercase font-extrabold text-brand-purple tracking-wider">Side B</span>
            </div>
            <select
              value={algoBId}
              onChange={(e) => setAlgoBId(e.target.value)}
              className="bg-surfaceLight border border-surfaceBorder rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
            >
              {Object.values(battleType === 'sorting' ? SORTING_ALGORITHMS : GRAPH_ALGORITHMS).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Workspace */}
          <div className="min-h-[260px] flex items-center justify-center">
            {battleType === 'sorting' ? (
              <SortingVisualizer step={stepB} />
            ) : (
              <GraphVisualizer
                step={stepB}
                startNode={startNode}
                targetNode={targetNode}
                walls={walls}
                onToggleWall={() => {}}
              />
            )}
          </div>

          {/* Real-time counters */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="bg-surfaceLight/70 p-2.5 rounded-xl border border-surfaceBorder/60">
              <span className="text-gray-400 block text-[10px]">Comparisons</span>
              <span className="font-mono font-bold text-base text-amber-400">{metricsB.comparisons}</span>
            </div>
            <div className="bg-surfaceLight/70 p-2.5 rounded-xl border border-surfaceBorder/60">
              <span className="text-gray-400 block text-[10px]">Swaps / Writes</span>
              <span className="font-mono font-bold text-base text-rose-400">{metricsB.swaps}</span>
            </div>
            <div className="bg-surfaceLight/70 p-2.5 rounded-xl border border-surfaceBorder/60">
              <span className="text-gray-400 block text-[10px]">Total Ops</span>
              <span className="font-mono font-bold text-base text-brand-purple">{metricsB.operations}</span>
            </div>
          </div>

          {/* Theoretical vs Measured */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 bg-surface/60 p-2.5 rounded-xl border border-surfaceBorder/40">
            <div>
              Theoretical: <span className="font-mono text-white font-semibold">{algoB.averageTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-brand-purple" />
              <span>Micro-bench: <strong className="font-mono text-brand-purple">{benchB} ms</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Operations Chart & Theoretical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-cyan" />
            <span>Head-to-Head Operations Chart</span>
          </h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="metric" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '0.75rem',
                    color: '#F3F4F6'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey={algoA.name} fill="#06B6D4" radius={[6, 6, 0, 0]} />
                <Bar dataKey={algoB.name} fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Theoretical vs Practical Analysis Box */}
        <div className="glass-panel p-5 rounded-2xl border border-surfaceBorder/70 shadow-xl space-y-3 text-xs leading-relaxed text-gray-300">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Theoretical vs Practical</span>
          </h3>
          <p>
            <strong className="text-white">Why theoretical complexity matters:</strong> Big-O describes asymptotic scalability as input size <span className="font-mono text-brand-cyan">n ➔ ∞</span>.
          </p>
          <p>
            <strong className="text-white">Why browser benchmarks differ:</strong> Measured execution time includes JIT compilation warm-up, garbage collection cycles, and CPU branch prediction overhead.
          </p>
          <div className="p-3 rounded-xl bg-surfaceLight/80 border border-surfaceBorder/60 space-y-1">
            <div className="text-[11px] font-bold text-brand-cyan uppercase">Key Takeaway</div>
            <p className="text-[11px] text-gray-400">
              For small datasets (n &lt; 20), simpler algorithms like Insertion Sort often beat Quick Sort due to tiny constant factors and zero recursive stack allocation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
