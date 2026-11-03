// Searching Algorithms Engine for AlgoArena

export const SEARCHING_PSEUDOCODE = {
  linearSearch: [
    "function linearSearch(arr, target):",
    "  for i = 0 to n-1:",
    "    if arr[i] == target: return i",
    "  return -1"
  ],
  binarySearch: [
    "function binarySearch(arr, target):",
    "  low = 0, high = n - 1",
    "  while low <= high:",
    "    mid = floor((low + high) / 2)",
    "    if arr[mid] == target: return mid",
    "    else if arr[mid] < target: low = mid + 1",
    "    else: high = mid - 1",
    "  return -1"
  ]
};

// 1. Linear Search
export function generateLinearSearchSteps(array, target) {
  const steps = [];
  const arr = [...array];
  let comparisons = 0;
  let operations = 0;

  steps.push({
    array: [...arr],
    target,
    currentIndex: -1,
    foundIndex: -1,
    comparing: [],
    checkedIndices: [],
    description: `Initiating Linear Search for target value: ${target}.`,
    codeLine: 1,
    metrics: { comparisons, swaps: 0, operations }
  });

  const checked = [];
  let found = -1;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    operations++;
    checked.push(i);

    steps.push({
      array: [...arr],
      target,
      currentIndex: i,
      foundIndex: -1,
      comparing: [i],
      checkedIndices: [...checked],
      description: `Checking index ${i}: Value ${arr[i]} vs target ${target}.`,
      codeLine: 3,
      metrics: { comparisons, swaps: 0, operations }
    });

    if (arr[i] === target) {
      found = i;
      operations++;
      steps.push({
        array: [...arr],
        target,
        currentIndex: i,
        foundIndex: i,
        comparing: [i],
        checkedIndices: [...checked],
        description: `Target ${target} found at index ${i}!`,
        codeLine: 3,
        metrics: { comparisons, swaps: 0, operations }
      });
      break;
    }
  }

  if (found === -1) {
    operations++;
    steps.push({
      array: [...arr],
      target,
      currentIndex: -1,
      foundIndex: -1,
      comparing: [],
      checkedIndices: [...checked],
      description: `Target ${target} not found in array. Exhausted all elements.`,
      codeLine: 4,
      metrics: { comparisons, swaps: 0, operations }
    });
  }

  return steps;
}

// 2. Binary Search
export function generateBinarySearchSteps(array, target) {
  const steps = [];
  // Ensure array is sorted for binary search
  const arr = [...array].sort((a, b) => a - b);
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;
  let operations = 0;
  let found = -1;
  const discarded = [];

  steps.push({
    array: [...arr],
    target,
    low,
    high,
    mid: -1,
    foundIndex: -1,
    comparing: [],
    discardedIndices: [],
    description: `Binary Search requires a sorted array. Range: [0, ${high}]. Searching for ${target}.`,
    codeLine: 2,
    metrics: { comparisons, swaps: 0, operations }
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    operations++;

    steps.push({
      array: [...arr],
      target,
      low,
      high,
      mid,
      foundIndex: -1,
      comparing: [mid],
      discardedIndices: [...discarded],
      description: `Calculated mid index ${mid} with value ${arr[mid]}. Range: [${low}..${high}].`,
      codeLine: 4,
      metrics: { comparisons, swaps: 0, operations }
    });

    comparisons++;
    operations++;
    if (arr[mid] === target) {
      found = mid;
      steps.push({
        array: [...arr],
        target,
        low,
        high,
        mid,
        foundIndex: mid,
        comparing: [mid],
        discardedIndices: [...discarded],
        description: `Target ${target} MATCHED at index ${mid}!`,
        codeLine: 5,
        metrics: { comparisons, swaps: 0, operations }
      });
      break;
    } else if (arr[mid] < target) {
      comparisons++;
      for (let k = low; k <= mid; k++) discarded.push(k);
      low = mid + 1;
      steps.push({
        array: [...arr],
        target,
        low,
        high,
        mid,
        foundIndex: -1,
        comparing: [],
        discardedIndices: [...discarded],
        description: `${arr[mid]} < ${target}. Discarding left half; adjusting low to ${low}.`,
        codeLine: 6,
        metrics: { comparisons, swaps: 0, operations }
      });
    } else {
      comparisons++;
      for (let k = mid; k <= high; k++) discarded.push(k);
      high = mid - 1;
      steps.push({
        array: [...arr],
        target,
        low,
        high,
        mid,
        foundIndex: -1,
        comparing: [],
        discardedIndices: [...discarded],
        description: `${arr[mid]} > ${target}. Discarding right half; adjusting high to ${high}.`,
        codeLine: 7,
        metrics: { comparisons, swaps: 0, operations }
      });
    }
  }

  if (found === -1) {
    steps.push({
      array: [...arr],
      target,
      low,
      high,
      mid: -1,
      foundIndex: -1,
      comparing: [],
      discardedIndices: [...discarded],
      description: `Target ${target} does not exist in array (low > high).`,
      codeLine: 8,
      metrics: { comparisons, swaps: 0, operations }
    });
  }

  return steps;
}

export const SEARCHING_ALGORITHMS = {
  linearSearch: {
    id: "linearSearch",
    name: "Linear Search",
    category: "searching",
    generator: generateLinearSearchSteps,
    bestTime: "O(1)",
    averageTime: "O(n)",
    worstTime: "O(n)",
    space: "O(1)",
    description: "Sequentially checks each element in the list until a match is found or the whole list has been searched.",
    pseudocode: SEARCHING_PSEUDOCODE.linearSearch
  },
  binarySearch: {
    id: "binarySearch",
    name: "Binary Search",
    category: "searching",
    generator: generateBinarySearchSteps,
    bestTime: "O(1)",
    averageTime: "O(log n)",
    worstTime: "O(log n)",
    space: "O(1)",
    description: "Efficient search on sorted arrays by repeatedly halving the search interval.",
    pseudocode: SEARCHING_PSEUDOCODE.binarySearch
  }
};
