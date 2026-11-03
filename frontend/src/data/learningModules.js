// Comprehensive Educational Curriculum & Quizzes for AlgoArena

export const LEARNING_MODULES = {
  bubbleSort: {
    id: "bubbleSort",
    title: "Bubble Sort",
    category: "sorting",
    summary: "The simplest comparison-based sorting algorithm that repeatedly swaps adjacent elements.",
    principle: "Iterate through the list from left to right. At each adjacent pair, if the left element is larger than the right element, swap them. By the end of the first pass, the largest element 'bubbles up' to the rightmost position. Repeat for remaining elements.",
    applications: [
      "Educational pedagogy: Teaching sorting concepts and Big-O overhead.",
      "Detecting if an array is already sorted in a single pass O(n).",
      "Graphics hardware where small sets of primitive vertices need tiny adjustments."
    ],
    pitfalls: [
      "Forgetting the swapped flag optimization causing unnecessary O(n²) iterations on sorted arrays.",
      "Off-by-one errors in inner loop bounds (checking index + 1 beyond array length).",
      "Using Bubble Sort in production environments for n > 50."
    ],
    complexities: {
      best: "O(n) with swap flag",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1) Auxiliary"
    },
    quiz: [
      {
        question: "What is the best-case time complexity of an optimized Bubble Sort on a sorted array?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correct: 0,
        explanation: "With a boolean flag that detects whether any swaps took place, Bubble Sort terminates after a single O(n) pass if no swaps occurred."
      },
      {
        question: "Is standard Bubble Sort a stable sorting algorithm?",
        options: ["Yes, equal elements preserve their original relative order", "No, it randomly inverts equal elements", "Only for arrays under 10 elements", "Depends on array contents"],
        correct: 0,
        explanation: "Bubble Sort is stable because adjacent elements are only swapped when strictly greater (arr[j] > arr[j+1]), never when equal."
      },
      {
        question: "How many passes does standard unoptimized Bubble Sort take for an array of size n?",
        options: ["n - 1 passes", "n / 2 passes", "log n passes", "2n passes"],
        correct: 0,
        explanation: "After n - 1 passes, the first n - 1 largest elements are placed, which automatically leaves the smallest in position 0."
      }
    ]
  },

  selectionSort: {
    id: "selectionSort",
    title: "Selection Sort",
    category: "sorting",
    summary: "Selects the minimum element from the unsorted section and places it at the beginning.",
    principle: "Divides the array into a sorted sublist and an unsorted sublist. In each iteration, finds the smallest element in the unsorted portion and performs a single swap with the first unsorted index.",
    applications: [
      "Embedded microcontrollers where write operations to EEPROM/Flash memory are physically expensive (Selection Sort makes at most n swaps).",
      "Checking small subsets when memory writes are restricted."
    ],
    pitfalls: [
      "Assuming Selection Sort is stable (default swap implementation is unstable unless elements are shifted).",
      "Expecting O(n) best-case: Selection Sort always performs (n*(n-1))/2 comparisons regardless of initial order."
    ],
    complexities: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1) Auxiliary"
    },
    quiz: [
      {
        question: "What is the maximum number of memory swaps Selection Sort performs on an array of size n?",
        options: ["n - 1 swaps", "n² swaps", "n log n swaps", "2n swaps"],
        correct: 0,
        explanation: "Selection Sort performs at most one swap per outer loop pass, yielding at most n - 1 total swaps."
      },
      {
        question: "Why does Selection Sort perform O(n²) comparisons even on an already sorted array?",
        options: ["It still must scan the entire unsorted region to guarantee no smaller element exists", "Because of cache misses", "It restarts from index 0", "It creates recursive copies"],
        correct: 0,
        explanation: "Selection Sort has no early-exit mechanism; it must check every subsequent element to confirm the minimum."
      }
    ]
  },

  insertionSort: {
    id: "insertionSort",
    title: "Insertion Sort",
    category: "sorting",
    summary: "Builds a sorted sequence one element at a time, just like sorting playing cards in hand.",
    principle: "Takes elements one by one from the unsorted section and slides larger elements one spot to the right until the correct insertion position for the current key is found.",
    applications: [
      "Hybrid sorting engines: Timsort (used in Python and Java) and Introsort (used in C++ std::sort) switch to Insertion Sort for partitions smaller than 16-64 elements.",
      "Online algorithms: sorting data streams arriving in real time.",
      "Nearly-sorted arrays where it runs in near O(n) time."
    ],
    pitfalls: [
      "Overwriting values before saving the current key into a temporary variable.",
      "Using linear scan without shifting, or failing to break the inner loop early when an element <= key is encountered."
    ],
    complexities: {
      best: "O(n) for already sorted arrays",
      average: "O(n²)",
      worst: "O(n²) for reverse sorted arrays",
      space: "O(1) Auxiliary"
    },
    quiz: [
      {
        question: "Why is Insertion Sort preferred over QuickSort for tiny arrays (n < 20)?",
        options: ["Lower constant factor overhead, great CPU cache locality, and simplicity", "It has O(log n) time", "It uses no stack space", "It runs in parallel"],
        correct: 0,
        explanation: "Insertion Sort has negligible constant factor overhead and minimal branch mispredictions on small datasets."
      },
      {
        question: "If an array is already sorted, how many comparisons does Insertion Sort make?",
        options: ["n - 1 comparisons", "n² comparisons", "0 comparisons", "n / 2 comparisons"],
        correct: 0,
        explanation: "Each element is compared once with its predecessor and immediately retained without shifting."
      }
    ]
  },

  mergeSort: {
    id: "mergeSort",
    title: "Merge Sort",
    category: "sorting",
    summary: "Guaranteed O(n log n) divide-and-conquer sorting algorithm with stable order preservation.",
    principle: "Divides the array into two halves recursively until arrays of size 1 remain. Then merges pairs of sorted subarrays into a combined sorted list by comparing front elements.",
    applications: [
      "Sorting linked lists (efficient without contiguous memory reallocation).",
      "External sorting on massive datasets stored on hard drives that do not fit into RAM.",
      "Situations where predictable worst-case O(n log n) runtime and stability are strictly required."
    ],
    pitfalls: [
      "Requiring O(n) auxiliary memory space for merging array buffers.",
      "Recursion depth stack overflow on deeply nested unoptimized implementations without tail recursion or iteration."
    ],
    complexities: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n) Auxiliary"
    },
    quiz: [
      {
        question: "What is the primary drawback of Merge Sort when sorting standard in-memory arrays?",
        options: ["Requires O(n) additional auxiliary memory for merge buffers", "Unstable ordering", "Worst-case O(n²)", "Cannot handle duplicate keys"],
        correct: 0,
        explanation: "Standard array merge operations require a temporary buffer of size O(n) to combine elements."
      },
      {
        question: "What is the recurrence relation describing Merge Sort?",
        options: ["T(n) = 2T(n/2) + O(n)", "T(n) = T(n-1) + O(1)", "T(n) = 2T(n-1) + O(n)", "T(n) = T(n/2) + O(1)"],
        correct: 0,
        explanation: "Dividing into two halves of size n/2 takes 2T(n/2), and the merge step takes linear O(n) time."
      }
    ]
  },

  quickSort: {
    id: "quickSort",
    title: "Quick Sort",
    category: "sorting",
    summary: "The widely used partition-based divide-and-conquer algorithm with phenomenal cache performance.",
    principle: "Selects a pivot element and partitions the array such that all elements smaller than the pivot precede it, and all larger elements succeed it. Recursively sorts the left and right sub-arrays.",
    applications: [
      "Default sorting implementation in standard libraries across C, C++, Go, and V8 engine.",
      "Cache-friendly large-scale array sorting in high performance computing."
    ],
    pitfalls: [
      "Choosing a bad pivot (e.g., always choosing first or last element) on already-sorted data degrades performance to O(n²).",
      "Stack space reaching O(n) in worst-case recursion without tail-call optimization."
    ],
    complexities: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²) with poor pivot choices",
      space: "O(log n) stack space"
    },
    quiz: [
      {
        question: "When does Quick Sort degrade to its worst-case O(n²) time complexity?",
        options: ["When the pivot chosen is consistently the smallest or largest element (e.g. sorted input with last-element pivot)", "When array has odd length", "When elements are floating point numbers", "When using Hoare partition"],
        correct: 0,
        explanation: "Unbalanced partitions of sizes 0 and n-1 lead to an arithmetic progression sum yielding O(n²)."
      },
      {
        question: "How can worst-case behavior in Quick Sort be avoided in modern implementations?",
        options: ["Randomized pivot selection or Median-of-Three pivot strategy", "Doubling array size", "Replacing arrays with trees", "Sorting backwards"],
        correct: 0,
        explanation: "Median-of-three (first, middle, last) and randomized pivots drastically reduce the odds of unbalanced partitions."
      }
    ]
  },

  heapSort: {
    id: "heapSort",
    title: "Heap Sort",
    category: "sorting",
    summary: "In-place comparison sorting algorithm that leverages a Binary Max-Heap data structure.",
    principle: "Converts the array into a max-heap where each parent node is greater than or equal to its children. Then repeatedly swaps the root (maximum element) with the last unsorted element and heapifies the reduced heap.",
    applications: [
      "Linux kernel and mission-critical embedded software where guaranteed O(n log n) time and O(1) auxiliary space are required.",
      "Systems with strict security guarantees where worst-case algorithmic degradation could cause denial of service."
    ],
    pitfalls: [
      "Poorer cache locality compared to QuickSort because heap jumps access memory by index doubling (2i + 1, 2i + 2).",
      "Not a stable sort."
    ],
    complexities: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1) Auxiliary"
    },
    quiz: [
      {
        question: "What is the time complexity to build a Max-Heap from an unsorted array of size n?",
        options: ["O(n) linear time", "O(n log n)", "O(n²)", "O(log n)"],
        correct: 0,
        explanation: "Bottom-up heap construction runs in mathematically proven O(n) time due to convergent series bounds."
      },
      {
        question: "Why does QuickSort often beat HeapSort in practice despite both having O(n log n) average time?",
        options: ["QuickSort exhibits superior spatial cache locality, whereas HeapSort jumps across memory addresses non-contiguously", "HeapSort requires extra RAM", "HeapSort is unstable", "HeapSort requires floating point operations"],
        correct: 0,
        explanation: "Heap parent-child indexing hops across memory cache lines, resulting in more L1/L2 cache misses."
      }
    ]
  },

  linearSearch: {
    id: "linearSearch",
    title: "Linear Search",
    category: "searching",
    summary: "Examines every element in order until the target is found or the collection ends.",
    principle: "Start from index 0 and inspect each element sequentially. If array[i] matches target, return index i. If reaching the end without a match, return -1.",
    applications: [
      "Searching unsorted collections where sorting overhead would exceed search time.",
      "Singly-linked lists where random access indexing is unavailable.",
      "Tiny arrays (n < 10) where simplicity dominates."
    ],
    pitfalls: [
      "Using linear search repeatedly on static data instead of preprocessing with sorting + binary search or hash map.",
      "Failing to handle boundary conditions (empty arrays, item at index 0 or n - 1)."
    ],
    complexities: {
      best: "O(1) item at first index",
      average: "O(n)",
      worst: "O(n) item at end or absent",
      space: "O(1)"
    },
    quiz: [
      {
        question: "Under what condition is Linear Search optimal over Binary Search?",
        options: ["When the dataset is unsorted and searched only once or twice", "Always for large datasets", "When memory is full", "When keys are strings"],
        correct: 0,
        explanation: "Sorting takes O(n log n); doing a single Linear Search is O(n), saving computational cycles."
      }
    ]
  },

  binarySearch: {
    id: "binarySearch",
    title: "Binary Search",
    category: "searching",
    summary: "Logarithmic search algorithm that halves the candidate search interval at every step.",
    principle: "Requires a sorted array. Compares target with middle element. If equal, target is found. If target is smaller, search continues in left half; otherwise in right half.",
    applications: [
      "Database B-Tree and index lookups.",
      "Debugging via Git Bisect (locating the commit that introduced a regression).",
      "Computing mathematical roots and optimization search spaces."
    ],
    pitfalls: [
      "Integer overflow bug: `(low + high) / 2` can overflow in fixed-width 32-bit integers; use `low + Math.floor((high - low) / 2)`.",
      "Off-by-one errors with `low <= high` vs `low < high`, and `mid + 1` / `mid - 1` boundaries."
    ],
    complexities: {
      best: "O(1) item at middle",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1) Iterative"
    },
    quiz: [
      {
        question: "How many maximum comparisons does Binary Search take on an array with 1,000,000 sorted elements?",
        options: ["Approx 20 comparisons", "500,000 comparisons", "1,000 comparisons", "100 comparisons"],
        correct: 0,
        explanation: "ceil(log2(1,000,000)) = 20 comparisons."
      }
    ]
  },

  bfs: {
    id: "bfs",
    title: "Breadth-First Search (BFS)",
    category: "graph",
    summary: "Layer-by-layer graph traversal exploring all neighbors before advancing to subsequent depths.",
    principle: "Uses a First-In-First-Out (FIFO) queue. Enqueues the start vertex, marks it visited. While the queue has elements, dequeues a node, inspects its unvisited neighbors, marks them visited, and enqueues them.",
    applications: [
      "Finding shortest path in unweighted graphs (e.g. social network degrees of separation).",
      "Web crawlers indexing pages layer by layer.",
      "Broadcasting in computer networking and garbage collection mark-sweep."
    ],
    pitfalls: [
      "Using a stack instead of a queue turns BFS into DFS.",
      "Forgetting to mark nodes visited upon enqueueing causes duplicate nodes in queue and exponential memory blowup."
    ],
    complexities: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V) queue capacity"
    },
    quiz: [
      {
        question: "Which data structure is essential for implementing Breadth-First Search?",
        options: ["Queue (FIFO)", "Stack (LIFO)", "Priority Queue", "Disjoint Set Union"],
        correct: 0,
        explanation: "A FIFO Queue ensures vertices are explored in order of their topological distance from start."
      }
    ]
  },

  dfs: {
    id: "dfs",
    title: "Depth-First Search (DFS)",
    category: "graph",
    summary: "Traverses along branch paths as deep as possible before backtracking.",
    principle: "Uses a Last-In-First-Out (LIFO) stack or call-stack recursion. Visits a node, then recursively visits an unvisited neighbor until a dead-end is reached, then backtracks.",
    applications: [
      "Topological sorting in build dependency graph systems.",
      "Detecting cycles in directed and undirected graphs.",
      "Solving mazes and finding strongly connected components (Kosaraju / Tarjan)."
    ],
    pitfalls: [
      "Stack overflow errors on deep graph chains without tail recursion or iterative stack.",
      "DFS does NOT guarantee finding the shortest path between two vertices in general graphs."
    ],
    complexities: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V) call stack"
    },
    quiz: [
      {
        question: "Can standard DFS be relied upon to find the shortest path in an unweighted graph?",
        options: ["No, DFS explores paths deeply and may find a much longer path first", "Yes, always", "Only if weights are negative", "Only if graph is bipartite"],
        correct: 0,
        explanation: "DFS traverses one branch to its deep conclusion; the first path found may be circuitous."
      }
    ]
  },

  dijkstra: {
    id: "dijkstra",
    title: "Dijkstra's Shortest Path",
    category: "graph",
    summary: "Finds the single-source shortest path in non-negative weighted graphs.",
    principle: "Maintains a set of tentative distances initialized to infinity (0 for start). Extracts the vertex with the lowest tentative distance using a min-priority queue, then relaxes all outgoing edges.",
    applications: [
      "GPS mapping and turn-by-turn vehicle routing (Google Maps, Waze).",
      "Network routing protocols such as OSPF (Open Shortest Path First) and IS-IS."
    ],
    pitfalls: [
      "Cannot handle negative edge weights (infinite loop or incorrect shortest paths; use Bellman-Ford instead).",
      "Using an unindexed array priority queue degrades runtime from O((V+E) log V) to O(V²)."
    ],
    complexities: {
      best: "O((V + E) log V)",
      average: "O((V + E) log V)",
      worst: "O((V + E) log V)",
      space: "O(V)"
    },
    quiz: [
      {
        question: "What happens if Dijkstra's algorithm is executed on a graph with negative edge weights?",
        options: ["It may compute incorrect shortest paths or cycle indefinitely because greedily finalized distances can be invalidated", "It automatically switches to BFS", "It works perfectly", "It crashes with OutOfMemoryError"],
        correct: 0,
        explanation: "Dijkstra relies on the greedy premise that adding an edge only increases path cost, which negative weights violate."
      }
    ]
  },

  astar: {
    id: "astar",
    title: "A* Search Algorithm",
    category: "graph",
    summary: "Heuristically guided graph search that dramatically prunes the search space toward the goal.",
    principle: "Evaluates nodes by f(n) = g(n) + h(n), where g(n) is the exact cost from start to node n, and h(n) is an admissible heuristic estimate of the cost from node n to the goal.",
    applications: [
      "Video game AI pathfinding (StarCraft, RPG navigation, NPC movement).",
      "Robotic motion planning avoiding obstacles in continuous or discretized maps."
    ],
    pitfalls: [
      "Using an inadmissible heuristic (overestimating true remaining cost) loses the guarantee of finding the shortest path.",
      "High memory consumption storing open and closed node sets in large 3D state spaces."
    ],
    complexities: {
      best: "O(1) with perfect heuristic",
      average: "O(E) in typical maps",
      worst: "O(b^d) exponential in worst case without informative heuristic",
      space: "O(V)"
    },
    quiz: [
      {
        question: "What property must the heuristic h(n) satisfy for A* to guarantee finding the optimal shortest path?",
        options: ["It must be admissible (never overestimate the true cost to target)", "It must be strictly zero", "It must exceed the true distance", "It must be randomized"],
        correct: 0,
        explanation: "Admissibility ensures A* never prematurely terminates with a suboptimal path."
      }
    ]
  },

  fibonacci: {
    id: "fibonacci",
    title: "Fibonacci (DP)",
    category: "dynamic-programming",
    summary: "The quintessential dynamic programming example illustrating overlapping subproblems and memoization.",
    principle: "Naive recursion computes F(n-1) and F(n-2) independently, causing exponential O(2^n) work. DP solves each subproblem once, storing the result in a table or two rolling variables.",
    applications: [
      "Financial market time series modeling and technical analysis retracements.",
      "Biological branching models and seed phyllotaxis patterns.",
      "Foundational demonstration of memoization vs tabulation."
    ],
    pitfalls: [
      "Computing naive Fibonacci recursively for n > 45 freezes the thread due to 2^45 function calls.",
      "Integer overflow with JavaScript numbers when n > 78 (requires BigInt)."
    ],
    complexities: {
      best: "O(n) time, O(1) space with two variables",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n) with array table, or O(1) with rolling pointers"
    },
    quiz: [
      {
        question: "What is the time complexity of the naive unmemoized recursive Fibonacci function?",
        options: ["O(2^n) exponential", "O(n)", "O(n²)", "O(log n)"],
        correct: 0,
        explanation: "The recursive call tree branches by two at each step, generating 2^n operations."
      }
    ]
  },

  knapsack: {
    id: "knapsack",
    title: "0/1 Knapsack Problem",
    category: "dynamic-programming",
    summary: "Selects items with given weights and values to maximize total value without exceeding capacity.",
    principle: "Constructs a 2D table dp[i][w] where cell represents the maximum value achievable considering first i items with capacity w. At each item, either exclude it or include it (if weight permits).",
    applications: [
      "Resource allocation, financial portfolio optimization, and capital budgeting.",
      "Cargo loading, cloud VM resource packing, and container freight allocation."
    ],
    pitfalls: [
      "Confusing 0/1 Knapsack (items cannot be divided) with Fractional Knapsack (which is solved greedily).",
      "Pseudo-polynomial runtime: O(n * W) depends on numerical value of W, not input length."
    ],
    complexities: {
      best: "O(n * W)",
      average: "O(n * W)",
      worst: "O(n * W)",
      space: "O(n * W) or O(W) space-optimized"
    },
    quiz: [
      {
        question: "Why can the 0/1 Knapsack problem not be solved optimally using a simple Greedy approach?",
        options: ["Taking highest value/weight ratio items first can leave empty wasted capacity that prevents reaching optimal total value", "Greedy algorithms only work on graphs", "Weights are always prime numbers", "It has no subproblems"],
        correct: 0,
        explanation: "Greedy choice property fails when items cannot be split; selecting one item may preclude a better combination."
      }
    ]
  },

  lcs: {
    id: "lcs",
    title: "Longest Common Subsequence",
    category: "dynamic-programming",
    summary: "Finds the longest sequence of characters that appear in both strings in the same order.",
    principle: "Builds an (m+1) x (n+1) grid. If characters match, dp[i][j] = 1 + dp[i-1][j-1]. If mismatch, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    applications: [
      "Diff tools (git diff) comparing file changes line-by-line.",
      "Bioinformatics: DNA and protein sequence alignment.",
      "Version control merge conflict resolution and plagiarism detection."
    ],
    pitfalls: [
      "Confusing Subsequence (characters do not need to be contiguous) with Substring (must be contiguous).",
      "Index off-by-one errors when correlating 1-indexed DP table with 0-indexed strings."
    ],
    complexities: {
      best: "O(m * n)",
      average: "O(m * n)",
      worst: "O(m * n)",
      space: "O(m * n) or O(min(m, n))"
    },
    quiz: [
      {
        question: "What is the primary difference between Longest Common Subsequence and Longest Common Substring?",
        options: ["Subsequence characters need not be contiguous, whereas Substring characters must be immediately adjacent", "Subsequence only works on numbers", "Substring is O(1)", "There is no difference"],
        correct: 0,
        explanation: "Subsequence allows gaps between matched characters as long as relative order is maintained."
      }
    ]
  }
};
