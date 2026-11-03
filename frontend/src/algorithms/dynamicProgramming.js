// Dynamic Programming Algorithms Engine for AlgoArena (Fibonacci, 0/1 Knapsack, LCS)

export const DP_PSEUDOCODE = {
  fibonacci: [
    "dp[0] = 0, dp[1] = 1",
    "for i = 2 to n:",
    "  dp[i] = dp[i-1] + dp[i-2]",
    "return dp[n]"
  ],
  knapsack: [
    "for i = 0 to n:",
    "  for w = 0 to W:",
    "    if i == 0 or w == 0: dp[i][w] = 0",
    "    else if wt[i-1] <= w:",
    "      dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])",
    "    else: dp[i][w] = dp[i-1][w]"
  ],
  lcs: [
    "for i = 0 to m; for j = 0 to n:",
    "  if i == 0 or j == 0: dp[i][j] = 0",
    "  else if s1[i-1] == s2[j-1]:",
    "    dp[i][j] = 1 + dp[i-1][j-1]",
    "  else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])"
  ]
};

// 1. Fibonacci
export function generateFibonacciSteps(n = 8) {
  const steps = [];
  const dp = new Array(n + 1).fill(null);
  let operations = 0;
  let comparisons = 0;

  dp[0] = 0;
  dp[1] = 1;

  steps.push({
    dpArray: [...dp],
    currentIdx: 0,
    depIndices: [],
    description: `Base case established: F(0) = 0 and F(1) = 1.`,
    codeLine: 1,
    metrics: { comparisons: 0, swaps: 0, operations: 2 }
  });

  for (let i = 2; i <= n; i++) {
    operations += 2;
    steps.push({
      dpArray: [...dp],
      currentIdx: i,
      depIndices: [i - 1, i - 2],
      description: `Computing F(${i}) = F(${i - 1}) [${dp[i - 1]}] + F(${i - 2}) [${dp[i - 2]}].`,
      codeLine: 3,
      metrics: { comparisons, swaps: 0, operations }
    });

    dp[i] = dp[i - 1] + dp[i - 2];

    steps.push({
      dpArray: [...dp],
      currentIdx: i,
      depIndices: [i - 1, i - 2],
      description: `Stored result: F(${i}) = ${dp[i]}.`,
      codeLine: 3,
      metrics: { comparisons, swaps: 0, operations }
    });
  }

  steps.push({
    dpArray: [...dp],
    currentIdx: n,
    depIndices: [],
    description: `Fibonacci sequence up to F(${n}) = ${dp[n]} computed with O(n) time and O(n) space!`,
    codeLine: 4,
    metrics: { comparisons, swaps: 0, operations }
  });

  return steps;
}

// 2. 0/1 Knapsack
export function generateKnapsackSteps(
  weights = [2, 3, 4, 5],
  values = [3, 4, 5, 8],
  capacity = 7
) {
  const steps = [];
  const n = weights.length;
  // (n+1) rows, (capacity+1) cols
  const table = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  let comparisons = 0;
  let operations = 0;

  steps.push({
    table: table.map(r => [...r]),
    weights,
    values,
    capacity,
    currentRow: 0,
    currentCol: 0,
    depCells: [],
    description: `Initialized DP Table (${n + 1} x ${capacity + 1}) with zeros.`,
    codeLine: 3,
    metrics: { comparisons, swaps: 0, operations: 0 }
  });

  for (let i = 1; i <= n; i++) {
    const itemWeight = weights[i - 1];
    const itemVal = values[i - 1];

    for (let w = 1; w <= capacity; w++) {
      comparisons++;
      operations++;

      if (itemWeight <= w) {
        const includeVal = itemVal + table[i - 1][w - itemWeight];
        const excludeVal = table[i - 1][w];
        const chosenVal = Math.max(includeVal, excludeVal);
        table[i][w] = chosenVal;

        steps.push({
          table: table.map(r => [...r]),
          weights,
          values,
          capacity,
          currentRow: i,
          currentCol: w,
          depCells: [
            { row: i - 1, col: w },
            { row: i - 1, col: w - itemWeight }
          ],
          description: `Item ${i} (w=${itemWeight}, v=${itemVal}) fits in cap ${w}: max(include [${includeVal}], exclude [${excludeVal}]) = ${chosenVal}.`,
          codeLine: 5,
          metrics: { comparisons, swaps: 0, operations }
        });
      } else {
        table[i][w] = table[i - 1][w];
        steps.push({
          table: table.map(r => [...r]),
          weights,
          values,
          capacity,
          currentRow: i,
          currentCol: w,
          depCells: [{ row: i - 1, col: w }],
          description: `Item ${i} (w=${itemWeight}) too heavy for cap ${w}. Copying previous best: ${table[i - 1][w]}.`,
          codeLine: 6,
          metrics: { comparisons, swaps: 0, operations }
        });
      }
    }
  }

  // Backtrack to find selected items
  const selectedItems = [];
  let currW = capacity;
  for (let i = n; i > 0 && currW > 0; i--) {
    if (table[i][currW] !== table[i - 1][currW]) {
      selectedItems.push(i - 1);
      currW -= weights[i - 1];
    }
  }

  steps.push({
    table: table.map(r => [...r]),
    weights,
    values,
    capacity,
    currentRow: n,
    currentCol: capacity,
    depCells: [],
    selectedItems,
    description: `Knapsack solved! Max value = ${table[n][capacity]}. Selected item indices: [${selectedItems.join(', ')}].`,
    codeLine: 6,
    metrics: { comparisons, swaps: 0, operations }
  });

  return steps;
}

// 3. Longest Common Subsequence (LCS)
export function generateLCSSteps(s1 = "AGTB", s2 = "GTX") {
  const steps = [];
  const m = s1.length;
  const n = s2.length;
  const table = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let comparisons = 0;
  let operations = 0;

  steps.push({
    table: table.map(r => [...r]),
    s1,
    s2,
    currentRow: 0,
    currentCol: 0,
    depCells: [],
    description: `Initialized LCS DP table for strings "${s1}" and "${s2}".`,
    codeLine: 2,
    metrics: { comparisons, swaps: 0, operations: 0 }
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      comparisons++;
      operations++;

      if (s1[i - 1] === s2[j - 1]) {
        table[i][j] = 1 + table[i - 1][j - 1];
        steps.push({
          table: table.map(r => [...r]),
          s1,
          s2,
          currentRow: i,
          currentCol: j,
          depCells: [{ row: i - 1, col: j - 1 }],
          description: `Characters match: s1[${i - 1}] == s2[${j - 1}] ('${s1[i - 1]}'). dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] = ${table[i][j]}.`,
          codeLine: 4,
          metrics: { comparisons, swaps: 0, operations }
        });
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
        steps.push({
          table: table.map(r => [...r]),
          s1,
          s2,
          currentRow: i,
          currentCol: j,
          depCells: [
            { row: i - 1, col: j },
            { row: i, col: j - 1 }
          ],
          description: `Mismatch ('${s1[i - 1]}' != '${s2[j - 1]}'): max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${table[i][j]}.`,
          codeLine: 5,
          metrics: { comparisons, swaps: 0, operations }
        });
      }
    }
  }

  // Backtrack LCS string
  let lcsStr = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcsStr = s1[i - 1] + lcsStr;
      i--;
      j--;
    } else if (table[i - 1][j] > table[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  steps.push({
    table: table.map(r => [...r]),
    s1,
    s2,
    currentRow: m,
    currentCol: n,
    depCells: [],
    lcsResult: lcsStr,
    description: `LCS computation complete! Length = ${table[m][n]}, Sequence = "${lcsStr}".`,
    codeLine: 5,
    metrics: { comparisons, swaps: 0, operations }
  });

  return steps;
}

export const DP_ALGORITHMS = {
  fibonacci: {
    id: "fibonacci",
    name: "Fibonacci (DP)",
    category: "dynamic-programming",
    generator: generateFibonacciSteps,
    bestTime: "O(n)",
    averageTime: "O(n)",
    worstTime: "O(n)",
    space: "O(n)",
    description: "Computes the n-th Fibonacci number by building subproblem solutions from F(0) and F(1) bottom-up.",
    pseudocode: DP_PSEUDOCODE.fibonacci
  },
  knapsack: {
    id: "knapsack",
    name: "0/1 Knapsack",
    category: "dynamic-programming",
    generator: generateKnapsackSteps,
    bestTime: "O(n * W)",
    averageTime: "O(n * W)",
    worstTime: "O(n * W)",
    space: "O(n * W)",
    description: "Maximizes value within weight capacity by deciding whether to include or exclude each item.",
    pseudocode: DP_PSEUDOCODE.knapsack
  },
  lcs: {
    id: "lcs",
    name: "Longest Common Subsequence",
    category: "dynamic-programming",
    generator: generateLCSSteps,
    bestTime: "O(m * n)",
    averageTime: "O(m * n)",
    worstTime: "O(m * n)",
    space: "O(m * n)",
    description: "Finds the length of the longest subsequence present in both sequences in the same relative order.",
    pseudocode: DP_PSEUDOCODE.lcs
  }
};
