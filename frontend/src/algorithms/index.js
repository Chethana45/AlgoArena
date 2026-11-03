import { SORTING_ALGORITHMS } from './sorting';
import { SEARCHING_ALGORITHMS } from './searching';
import { GRAPH_ALGORITHMS } from './graph';
import { DP_ALGORITHMS } from './dynamicProgramming';

export * from './sorting';
export * from './searching';
export * from './graph';
export * from './dynamicProgramming';

export const ALL_ALGORITHMS = {
  ...SORTING_ALGORITHMS,
  ...SEARCHING_ALGORITHMS,
  ...GRAPH_ALGORITHMS,
  ...DP_ALGORITHMS,
};

export const ALGORITHM_CATEGORIES = [
  { id: 'sorting', label: 'Sorting', icon: 'BarChart2', count: 6 },
  { id: 'searching', label: 'Searching', icon: 'Search', count: 2 },
  { id: 'graph', label: 'Graph', icon: 'GitBranch', count: 4 },
  { id: 'dynamic-programming', label: 'Dynamic Programming', icon: 'Table', count: 3 },
];

// Dataset generators
export function generateDataset(type = 'random', size = 20, min = 5, max = 100) {
  const arr = [];
  const span = max - min;

  switch (type) {
    case 'sorted':
      for (let i = 0; i < size; i++) {
        arr.push(Math.round(min + (i / (size - 1 || 1)) * span));
      }
      break;

    case 'reverse':
      for (let i = 0; i < size; i++) {
        arr.push(Math.round(max - (i / (size - 1 || 1)) * span));
      }
      break;

    case 'duplicates': {
      const pool = [15, 30, 45, 60, 80];
      for (let i = 0; i < size; i++) {
        arr.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      break;
    }

    case 'nearlySorted': {
      for (let i = 0; i < size; i++) {
        arr.push(Math.round(min + (i / (size - 1 || 1)) * span));
      }
      // Swap 2 to 3 random pairs
      const swapsCount = Math.max(1, Math.floor(size * 0.1));
      for (let s = 0; s < swapsCount; s++) {
        const i1 = Math.floor(Math.random() * size);
        const i2 = Math.floor(Math.random() * size);
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
      }
      break;
    }

    case 'random':
    default:
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      break;
  }

  return arr;
}

export function parseCustomInput(inputString, fallbackSize = 15) {
  if (!inputString || typeof inputString !== 'string') {
    return generateDataset('random', fallbackSize);
  }
  const parsed = inputString
    .split(/[,\s]+/)
    .map(val => parseInt(val.trim(), 10))
    .filter(val => !isNaN(val) && val >= 1 && val <= 500);

  if (parsed.length === 0) {
    return generateDataset('random', fallbackSize);
  }
  return parsed.slice(0, 50); // cap to 50 for smooth UI rendering
}
