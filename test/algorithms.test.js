import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps
} from '../frontend/src/algorithms/sorting.js';

import {
  generateLinearSearchSteps,
  generateBinarySearchSteps
} from '../frontend/src/algorithms/searching.js';

import {
  generateBFSSteps,
  generateDFSSteps,
  generateDijkstraSteps,
  generateAStarSteps,
  getGridNeighbors
} from '../frontend/src/algorithms/graph.js';

import {
  generateFibonacciSteps,
  generateKnapsackSteps,
  generateLCSSteps
} from '../frontend/src/algorithms/dynamicProgramming.js';

const sortingAlgorithms = [
  { name: 'Bubble Sort', fn: generateBubbleSortSteps },
  { name: 'Selection Sort', fn: generateSelectionSortSteps },
  { name: 'Insertion Sort', fn: generateInsertionSortSteps },
  { name: 'Merge Sort', fn: generateMergeSortSteps },
  { name: 'Quick Sort', fn: generateQuickSortSteps },
  { name: 'Heap Sort', fn: generateHeapSortSteps }
];

test('=== SORTING ALGORITHMS SUITE ===', async (t) => {
  for (const { name, fn } of sortingAlgorithms) {
    await t.test(`${name}: standard unsorted array`, () => {
      const input = [45, 12, 89, 34, 67, 23, 99, 10];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      const expected = [...input].sort((a, b) => a - b);
      assert.deepEqual(finalArray, expected);
    });

    await t.test(`${name}: empty array`, () => {
      const input = [];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      assert.deepEqual(finalArray, []);
    });

    await t.test(`${name}: single-element array`, () => {
      const input = [42];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      assert.deepEqual(finalArray, [42]);
    });

    await t.test(`${name}: array with heavy duplicates`, () => {
      const input = [5, 2, 8, 2, 5, 1, 8, 2];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      const expected = [...input].sort((a, b) => a - b);
      assert.deepEqual(finalArray, expected);
    });

    await t.test(`${name}: already sorted array`, () => {
      const input = [1, 2, 3, 4, 5, 6, 7];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      assert.deepEqual(finalArray, [1, 2, 3, 4, 5, 6, 7]);
    });

    await t.test(`${name}: reverse-sorted array`, () => {
      const input = [90, 70, 50, 30, 10];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      assert.deepEqual(finalArray, [10, 30, 50, 70, 90]);
    });

    await t.test(`${name}: array containing negative values`, () => {
      const input = [-15, 4, -2, 0, 8, -50, 12];
      const steps = fn(input);
      const finalArray = steps[steps.length - 1].array;
      const expected = [...input].sort((a, b) => a - b);
      assert.deepEqual(finalArray, expected);
    });
  }
});

test('=== SEARCHING ALGORITHMS SUITE ===', async (t) => {
  await t.test('Linear Search: finds existing target', () => {
    const arr = [10, 20, 30, 40, 50];
    const steps = generateLinearSearchSteps(arr, 30);
    const finalStep = steps[steps.length - 1];
    assert.equal(finalStep.foundIndex, 2);
  });

  await t.test('Linear Search: target not found returns -1', () => {
    const arr = [10, 20, 30, 40, 50];
    const steps = generateLinearSearchSteps(arr, 99);
    const finalStep = steps[steps.length - 1];
    assert.equal(finalStep.foundIndex, -1);
  });

  await t.test('Binary Search: finds target in sorted array', () => {
    const arr = [5, 12, 19, 27, 34, 45, 60, 78, 92];
    const steps = generateBinarySearchSteps(arr, 34);
    const finalStep = steps[steps.length - 1];
    assert.equal(finalStep.foundIndex, 4);
  });

  await t.test('Binary Search: boundary targets (first & last)', () => {
    const arr = [5, 12, 19, 27, 34];
    const stepsFirst = generateBinarySearchSteps(arr, 5);
    assert.equal(stepsFirst[stepsFirst.length - 1].foundIndex, 0);

    const stepsLast = generateBinarySearchSteps(arr, 34);
    assert.equal(stepsLast[stepsLast.length - 1].foundIndex, 4);
  });

  await t.test('Binary Search: absent element returns -1', () => {
    const arr = [5, 12, 19, 27, 34];
    const steps = generateBinarySearchSteps(arr, 20);
    assert.equal(steps[steps.length - 1].foundIndex, -1);
  });
});

test('=== GRAPH ALGORITHMS SUITE ===', async (t) => {
  const start = { row: 0, col: 0 };
  const target = { row: 3, col: 3 };
  const emptyWalls = new Set();
  const rows = 5;
  const cols = 5;

  await t.test('BFS: finds path to reachable target', () => {
    const steps = generateBFSSteps(emptyWalls, start, target, rows, cols);
    const finalStep = steps[steps.length - 1];
    assert.ok(finalStep.path.length > 0, 'Path should be found');
    assert.deepEqual(finalStep.path[0], { row: 0, col: 0, key: '0,0' });
    assert.deepEqual(finalStep.path[finalStep.path.length - 1], { row: 3, col: 3, key: '3,3' });
  });

  await t.test('DFS: traverses to reachable target', () => {
    const steps = generateDFSSteps(emptyWalls, start, target, rows, cols);
    const finalStep = steps[steps.length - 1];
    assert.ok(finalStep.path.length > 0, 'Path should be found');
  });

  await t.test('Dijkstra: calculates shortest path', () => {
    const steps = generateDijkstraSteps(emptyWalls, start, target, rows, cols);
    const finalStep = steps[steps.length - 1];
    assert.ok(finalStep.path.length > 0);
  });

  await t.test('A*: reaches destination using heuristic guidance', () => {
    const steps = generateAStarSteps(emptyWalls, start, target, rows, cols);
    const finalStep = steps[steps.length - 1];
    assert.ok(finalStep.path.length > 0);
    assert.deepEqual(finalStep.path[finalStep.path.length - 1], { row: 3, col: 3, key: '3,3' });
  });

  await t.test('Graph: unreachable target surrounded by walls', () => {
    // Encapsulate target with walls
    const blockedWalls = new Set(['2,3', '3,2', '4,3', '3,4']);
    const steps = generateBFSSteps(blockedWalls, start, target, rows, cols);
    const finalStep = steps[steps.length - 1];
    assert.equal(finalStep.path.length, 0, 'Target should be unreachable');
  });
});

test('=== DYNAMIC PROGRAMMING SUITE ===', async (t) => {
  await t.test('Fibonacci: computes accurate sequence up to F(8)', () => {
    const steps = generateFibonacciSteps(8);
    const finalStep = steps[steps.length - 1];
    assert.equal(finalStep.dpArray[0], 0);
    assert.equal(finalStep.dpArray[1], 1);
    assert.equal(finalStep.dpArray[2], 1);
    assert.equal(finalStep.dpArray[3], 2);
    assert.equal(finalStep.dpArray[4], 3);
    assert.equal(finalStep.dpArray[5], 5);
    assert.equal(finalStep.dpArray[6], 8);
    assert.equal(finalStep.dpArray[7], 13);
    assert.equal(finalStep.dpArray[8], 21);
  });

  await t.test('0/1 Knapsack: finds optimal value for capacity', () => {
    const weights = [1, 2, 3];
    const values = [6, 10, 12];
    const capacity = 5;
    const steps = generateKnapsackSteps(weights, values, capacity);
    const finalStep = steps[steps.length - 1];
    // Best combination is item 2 + item 3 (weights 2+3=5, values 10+12=22)
    assert.equal(finalStep.table[3][5], 22);
  });

  await t.test('Longest Common Subsequence: computes correct subsequence', () => {
    const steps = generateLCSSteps('ABCBDAB', 'BDCAB');
    const finalStep = steps[steps.length - 1];
    assert.equal(finalStep.table[7][5], 4); // "BCAB" or "BDAB" length = 4
    assert.equal(finalStep.lcsResult.length, 4);
  });
});
