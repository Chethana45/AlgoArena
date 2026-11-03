// Graph Algorithms Engine for AlgoArena (BFS, DFS, Dijkstra, A*)

export const GRAPH_PSEUDOCODE = {
  bfs: [
    "queue.enqueue(startNode); visited.add(startNode)",
    "while queue is not empty:",
    "  current = queue.dequeue()",
    "  if current == target: return reconstructPath()",
    "  for neighbor in getNeighbors(current):",
    "    if neighbor not in visited and not isWall(neighbor):",
    "      visited.add(neighbor); parent[neighbor] = current",
    "      queue.enqueue(neighbor)"
  ],
  dfs: [
    "stack.push(startNode); visited.add(startNode)",
    "while stack is not empty:",
    "  current = stack.pop()",
    "  if current == target: return reconstructPath()",
    "  for neighbor in getNeighbors(current):",
    "    if neighbor not in visited and not isWall(neighbor):",
    "      visited.add(neighbor); parent[neighbor] = current",
    "      stack.push(neighbor)"
  ],
  dijkstra: [
    "dist[start] = 0; priorityQueue.insert(start, 0)",
    "while priorityQueue is not empty:",
    "  current = priorityQueue.extractMin()",
    "  if current == target: return reconstructPath()",
    "  for neighbor in getNeighbors(current):",
    "    newDist = dist[current] + weight(current, neighbor)",
    "    if newDist < dist[neighbor]:",
    "      dist[neighbor] = newDist; parent[neighbor] = current",
    "      priorityQueue.insertOrUpdate(neighbor, newDist)"
  ],
  astar: [
    "fScore[start] = h(start, target); openSet.insert(start)",
    "while openSet is not empty:",
    "  current = openSet.extractLowestFScore()",
    "  if current == target: return reconstructPath()",
    "  for neighbor in getNeighbors(current):",
    "    tentativeG = gScore[current] + dist(current, neighbor)",
    "    if tentativeG < gScore[neighbor]:",
    "      parent[neighbor] = current; gScore[neighbor] = tentativeG",
    "      fScore[neighbor] = tentativeG + h(neighbor, target)"
  ]
};

export const GRID_ROWS = 15;
export const GRID_COLS = 25;

export function getGridNeighbors(row, col, rows = GRID_ROWS, cols = GRID_COLS) {
  const neighbors = [];
  const dirs = [
    [-1, 0], // UP
    [0, 1],  // RIGHT
    [1, 0],  // DOWN
    [0, -1]  // LEFT
  ];

  for (const [dr, dc] of dirs) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      neighbors.push({ row: nr, col: nc, key: `${nr},${nc}` });
    }
  }
  return neighbors;
}

export function reconstructPath(cameFrom, currentKey) {
  const path = [];
  let curr = currentKey;
  while (curr) {
    const [r, c] = curr.split(',').map(Number);
    path.unshift({ row: r, col: c, key: curr });
    curr = cameFrom[curr];
  }
  return path;
}

// 1. BFS
export function generateBFSSteps(gridWalls, start, target, rows = GRID_ROWS, cols = GRID_COLS) {
  const steps = [];
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;
  const visited = new Set([startKey]);
  const cameFrom = {};
  const queue = [{ row: start.row, col: start.col, key: startKey }];
  const visitedOrder = [];
  let operations = 0;

  steps.push({
    current: start,
    visitedNodes: [startKey],
    path: [],
    frontier: [startKey],
    description: `Initialized BFS Queue with Start Node at [${start.row}, ${start.col}].`,
    codeLine: 1,
    metrics: { comparisons: 0, swaps: 0, operations: 1 }
  });

  let found = false;

  while (queue.length > 0) {
    operations++;
    const current = queue.shift();
    visitedOrder.push(current.key);

    steps.push({
      current,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: queue.map(q => q.key),
      description: `Dequeued [${current.row}, ${current.col}]. Exploring neighboring vertices.`,
      codeLine: 3,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });

    if (current.key === targetKey) {
      found = true;
      const path = reconstructPath(cameFrom, targetKey);
      steps.push({
        current,
        visitedNodes: [...visitedOrder],
        path,
        frontier: [],
        description: `Target [${target.row}, ${target.col}] reached! Reconstructed shortest unweighted path of length ${path.length}.`,
        codeLine: 4,
        metrics: { comparisons: visitedOrder.length, swaps: 0, operations: operations + path.length }
      });
      break;
    }

    const neighbors = getGridNeighbors(current.row, current.col, rows, cols);
    for (const nb of neighbors) {
      if (!visited.has(nb.key) && !gridWalls.has(nb.key)) {
        visited.add(nb.key);
        cameFrom[nb.key] = current.key;
        queue.push(nb);
        operations++;
      }
    }
  }

  if (!found) {
    steps.push({
      current: null,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: [],
      description: `Queue exhausted. No path exists to target [${target.row}, ${target.col}].`,
      codeLine: 2,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });
  }

  return steps;
}

// 2. DFS
export function generateDFSSteps(gridWalls, start, target, rows = GRID_ROWS, cols = GRID_COLS) {
  const steps = [];
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;
  const visited = new Set();
  const cameFrom = {};
  const stack = [{ row: start.row, col: start.col, key: startKey }];
  const visitedOrder = [];
  let operations = 0;

  steps.push({
    current: start,
    visitedNodes: [],
    path: [],
    frontier: [startKey],
    description: `Initialized DFS Stack with Start Node at [${start.row}, ${start.col}].`,
    codeLine: 1,
    metrics: { comparisons: 0, swaps: 0, operations: 1 }
  });

  let found = false;

  while (stack.length > 0) {
    operations++;
    const current = stack.pop();

    if (visited.has(current.key)) continue;
    visited.add(current.key);
    visitedOrder.push(current.key);

    steps.push({
      current,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: stack.map(s => s.key),
      description: `Popped [${current.row}, ${current.col}] from stack. Diving deeper into branch.`,
      codeLine: 3,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });

    if (current.key === targetKey) {
      found = true;
      const path = reconstructPath(cameFrom, targetKey);
      steps.push({
        current,
        visitedNodes: [...visitedOrder],
        path,
        frontier: [],
        description: `Target reached via DFS exploration! Path length: ${path.length}.`,
        codeLine: 4,
        metrics: { comparisons: visitedOrder.length, swaps: 0, operations: operations + path.length }
      });
      break;
    }

    const neighbors = getGridNeighbors(current.row, current.col, rows, cols);
    for (const nb of neighbors) {
      if (!visited.has(nb.key) && !gridWalls.has(nb.key)) {
        cameFrom[nb.key] = current.key;
        stack.push(nb);
        operations++;
      }
    }
  }

  if (!found) {
    steps.push({
      current: null,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: [],
      description: `Target unreachable. DFS explored all reachable nodes.`,
      codeLine: 2,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });
  }

  return steps;
}

// 3. Dijkstra
export function generateDijkstraSteps(gridWalls, start, target, rows = GRID_ROWS, cols = GRID_COLS, weightsMap = new Map()) {
  const steps = [];
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;

  const dist = {};
  const cameFrom = {};
  const visited = new Set();
  const unvisited = [];
  const visitedOrder = [];
  let operations = 0;

  dist[startKey] = 0;
  unvisited.push({ row: start.row, col: start.col, key: startKey, dist: 0 });

  steps.push({
    current: start,
    visitedNodes: [],
    path: [],
    frontier: [startKey],
    description: `Initialized Dijkstra. Distance to Start = 0, all others = Infinity.`,
    codeLine: 1,
    metrics: { comparisons: 0, swaps: 0, operations: 1 }
  });

  let found = false;

  while (unvisited.length > 0) {
    operations++;
    // Extract min distance node
    unvisited.sort((a, b) => a.dist - b.dist);
    const current = unvisited.shift();

    if (visited.has(current.key)) continue;
    visited.add(current.key);
    visitedOrder.push(current.key);

    steps.push({
      current,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: unvisited.map(u => u.key),
      description: `Extracted min vertex [${current.row}, ${current.col}] with cumulative weight: ${current.dist}.`,
      codeLine: 3,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });

    if (current.key === targetKey) {
      found = true;
      const path = reconstructPath(cameFrom, targetKey);
      steps.push({
        current,
        visitedNodes: [...visitedOrder],
        path,
        frontier: [],
        description: `Dijkstra confirmed optimal shortest weighted path! Total cost: ${current.dist}.`,
        codeLine: 4,
        metrics: { comparisons: visitedOrder.length, swaps: 0, operations: operations + path.length }
      });
      break;
    }

    const neighbors = getGridNeighbors(current.row, current.col, rows, cols);
    for (const nb of neighbors) {
      if (gridWalls.has(nb.key) || visited.has(nb.key)) continue;

      const edgeWeight = weightsMap.get(nb.key) || 1;
      const alt = current.dist + edgeWeight;
      const existingDist = dist[nb.key] ?? Infinity;

      if (alt < existingDist) {
        dist[nb.key] = alt;
        cameFrom[nb.key] = current.key;
        unvisited.push({ row: nb.row, col: nb.col, key: nb.key, dist: alt });
        operations++;
      }
    }
  }

  if (!found) {
    steps.push({
      current: null,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: [],
      description: `Target node unreachable under Dijkstra.`,
      codeLine: 2,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });
  }

  return steps;
}

// 4. A* Search (Manhattan heuristic)
export function generateAStarSteps(gridWalls, start, target, rows = GRID_ROWS, cols = GRID_COLS) {
  const steps = [];
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;

  function heuristic(r, c) {
    return Math.abs(r - target.row) + Math.abs(c - target.col);
  }

  const gScore = { [startKey]: 0 };
  const fScore = { [startKey]: heuristic(start.row, start.col) };
  const cameFrom = {};
  const openSet = [{ row: start.row, col: start.col, key: startKey, f: fScore[startKey] }];
  const closedSet = new Set();
  const visitedOrder = [];
  let operations = 0;

  steps.push({
    current: start,
    visitedNodes: [],
    path: [],
    frontier: [startKey],
    description: `A* initialized with Start h-score: ${fScore[startKey]}.`,
    codeLine: 1,
    metrics: { comparisons: 0, swaps: 0, operations: 1 }
  });

  let found = false;

  while (openSet.length > 0) {
    operations++;
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (closedSet.has(current.key)) continue;
    closedSet.add(current.key);
    visitedOrder.push(current.key);

    steps.push({
      current,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: openSet.map(o => o.key),
      description: `Selected node [${current.row}, ${current.col}] with lowest f(n) = ${current.f.toFixed(1)}.`,
      codeLine: 3,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });

    if (current.key === targetKey) {
      found = true;
      const path = reconstructPath(cameFrom, targetKey);
      steps.push({
        current,
        visitedNodes: [...visitedOrder],
        path,
        frontier: [],
        description: `A* found optimal heuristic path of length ${path.length}!`,
        codeLine: 4,
        metrics: { comparisons: visitedOrder.length, swaps: 0, operations: operations + path.length }
      });
      break;
    }

    const neighbors = getGridNeighbors(current.row, current.col, rows, cols);
    for (const nb of neighbors) {
      if (gridWalls.has(nb.key) || closedSet.has(nb.key)) continue;

      const tentativeG = (gScore[current.key] ?? Infinity) + 1;
      if (tentativeG < (gScore[nb.key] ?? Infinity)) {
        cameFrom[nb.key] = current.key;
        gScore[nb.key] = tentativeG;
        const h = heuristic(nb.row, nb.col);
        const f = tentativeG + h;
        fScore[nb.key] = f;
        openSet.push({ row: nb.row, col: nb.col, key: nb.key, f });
        operations++;
      }
    }
  }

  if (!found) {
    steps.push({
      current: null,
      visitedNodes: [...visitedOrder],
      path: [],
      frontier: [],
      description: `Target unreachable from start node.`,
      codeLine: 2,
      metrics: { comparisons: visitedOrder.length, swaps: 0, operations }
    });
  }

  return steps;
}

export const GRAPH_ALGORITHMS = {
  bfs: {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "graph",
    generator: generateBFSSteps,
    bestTime: "O(V + E)",
    averageTime: "O(V + E)",
    worstTime: "O(V + E)",
    space: "O(V)",
    description: "Explores vertices level-by-level using a FIFO queue. Guarantees shortest path in unweighted graphs.",
    pseudocode: GRAPH_PSEUDOCODE.bfs
  },
  dfs: {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    category: "graph",
    generator: generateDFSSteps,
    bestTime: "O(V + E)",
    averageTime: "O(V + E)",
    worstTime: "O(V + E)",
    space: "O(V)",
    description: "Explores as deep as possible along each branch before backtracking using a LIFO stack.",
    pseudocode: GRAPH_PSEUDOCODE.dfs
  },
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Shortest Path",
    category: "graph",
    generator: generateDijkstraSteps,
    bestTime: "O((V + E) log V)",
    averageTime: "O((V + E) log V)",
    worstTime: "O((V + E) log V)",
    space: "O(V)",
    description: "Finds shortest paths from source to all vertices in non-negative weighted graphs using a priority queue.",
    pseudocode: GRAPH_PSEUDOCODE.dijkstra
  },
  astar: {
    id: "astar",
    name: "A* Search",
    category: "graph",
    generator: generateAStarSteps,
    bestTime: "O(1)",
    averageTime: "O(E)",
    worstTime: "O(b^d)",
    space: "O(V)",
    description: "Informed search algorithm using heuristic function f(n) = g(n) + h(n) to direct exploration toward target.",
    pseudocode: GRAPH_PSEUDOCODE.astar
  }
};
