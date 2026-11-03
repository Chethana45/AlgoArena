// Sorting Algorithms Step-by-Step Execution Engine for AlgoArena

export const SORTING_PSEUDOCODE = {
  bubbleSort: [
    "for i = 0 to n-1:",
    "  for j = 0 to n-i-2:",
    "    if array[j] > array[j+1]:",
    "      swap(array[j], array[j+1])",
    "  mark array[n-i-1] as sorted"
  ],
  selectionSort: [
    "for i = 0 to n-1:",
    "  min_idx = i",
    "  for j = i+1 to n-1:",
    "    if array[j] < array[min_idx]: min_idx = j",
    "  swap(array[i], array[min_idx])",
    "  mark array[i] as sorted"
  ],
  insertionSort: [
    "for i = 1 to n-1:",
    "  key = array[i]",
    "  j = i - 1",
    "  while j >= 0 and array[j] > key:",
    "    array[j+1] = array[j]; j--",
    "  array[j+1] = key"
  ],
  mergeSort: [
    "function mergeSort(arr, left, right):",
    "  if left >= right: return",
    "  mid = (left + right) / 2",
    "  mergeSort(arr, left, mid)",
    "  mergeSort(arr, mid+1, right)",
    "  merge(arr, left, mid, right)"
  ],
  quickSort: [
    "function quickSort(arr, low, high):",
    "  if low < high:",
    "    pi = partition(arr, low, high)",
    "    quickSort(arr, low, pi-1)",
    "    quickSort(arr, pi+1, high)"
  ],
  heapSort: [
    "buildMaxHeap(arr)",
    "for i = n-1 down to 1:",
    "  swap(arr[0], arr[i])",
    "  heapify(arr, i, 0)"
  ]
};

// 1. Bubble Sort
export function generateBubbleSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [...sortedIndices],
    activeIndices: [],
    description: "Initial array before Bubble Sort starts.",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      operations++;

      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [],
        description: `Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]}).`,
        codeLine: 3,
        metrics: { comparisons, swaps, operations }
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        swaps++;
        operations += 2;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swappedInPass = true;

        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          sortedIndices: [...sortedIndices],
          activeIndices: [],
          description: `Swapped index ${j} and ${j + 1} because ${arr[j + 1]} < ${arr[j]}.`,
          codeLine: 4,
          metrics: { comparisons, swaps, operations }
        });
      }
    }
    sortedIndices.push(n - i - 1);
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: [],
      description: `Element ${arr[n - i - 1]} at index ${n - i - 1} is now in its sorted position.`,
      codeLine: 5,
      metrics: { comparisons, swaps, operations }
    });

    if (!swappedInPass) {
      // Early termination optimization
      break;
    }
  }

  // Mark all as sorted
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [...sortedIndices],
    activeIndices: [],
    description: "Bubble Sort completed! Array is fully sorted.",
    codeLine: 5,
    metrics: { comparisons, swaps, operations }
  });

  return steps;
}

// 2. Selection Sort
export function generateSelectionSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [...sortedIndices],
    activeIndices: [],
    description: "Initial array before Selection Sort.",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: [minIdx],
      description: `Assumed element ${arr[minIdx]} at index ${i} is the current minimum.`,
      codeLine: 2,
      metrics: { comparisons, swaps, operations }
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      operations++;

      steps.push({
        array: [...arr],
        comparing: [j, minIdx],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [minIdx],
        description: `Comparing index ${j} (${arr[j]}) with current min at index ${minIdx} (${arr[minIdx]}).`,
        codeLine: 4,
        metrics: { comparisons, swaps, operations }
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sortedIndices: [...sortedIndices],
          activeIndices: [minIdx],
          description: `Found a smaller element: ${arr[minIdx]} at index ${minIdx}.`,
          codeLine: 4,
          metrics: { comparisons, swaps, operations }
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      operations += 2;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [i, minIdx],
        sortedIndices: [...sortedIndices],
        activeIndices: [],
        description: `Swapped index ${i} (${arr[minIdx]}) with min element (${arr[i]}).`,
        codeLine: 5,
        metrics: { comparisons, swaps, operations }
      });
    }

    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: [],
      description: `Index ${i} (${arr[i]}) placed in sorted position.`,
      codeLine: 6,
      metrics: { comparisons, swaps, operations }
    });
  }

  return steps;
}

// 3. Insertion Sort
export function generateInsertionSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  const sortedIndices = [0];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [...sortedIndices],
    activeIndices: [],
    description: "Starting Insertion Sort. First element is trivially sorted.",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: [i],
      description: `Selecting key element ${key} at index ${i} for insertion.`,
      codeLine: 2,
      metrics: { comparisons, swaps, operations }
    });

    while (j >= 0) {
      comparisons++;
      operations++;

      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [j + 1],
        description: `Comparing key (${key}) with sorted element ${arr[j]} at index ${j}.`,
        codeLine: 4,
        metrics: { comparisons, swaps, operations }
      });

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        swaps++;
        operations++;

        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          sortedIndices: [...sortedIndices],
          activeIndices: [j],
          description: `Shifted element ${arr[j]} right to index ${j + 1}.`,
          codeLine: 5,
          metrics: { comparisons, swaps, operations }
        });
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    operations++;
    if (!sortedIndices.includes(i)) sortedIndices.push(i);

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [j + 1],
      sortedIndices: [...sortedIndices],
      activeIndices: [],
      description: `Inserted key ${key} at index ${j + 1}.`,
      codeLine: 6,
      metrics: { comparisons, swaps, operations }
    });
  }

  // Mark all sorted
  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [...sortedIndices],
    activeIndices: [],
    description: "Insertion Sort completed!",
    codeLine: 6,
    metrics: { comparisons, swaps, operations }
  });

  return steps;
}

// 4. Merge Sort
export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [],
    activeIndices: [],
    description: "Starting Merge Sort (Divide and Conquer).",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  function merge(low, mid, high) {
    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
      description: `Merging sub-arrays [${low}..${mid}] and [${mid + 1}..${high}].`,
      codeLine: 6,
      metrics: { comparisons, swaps, operations }
    });

    while (i < left.length && j < right.length) {
      comparisons++;
      operations++;

      steps.push({
        array: [...arr],
        comparing: [low + i, mid + 1 + j],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [k],
        description: `Comparing left (${left[i]}) vs right (${right[j]}).`,
        codeLine: 6,
        metrics: { comparisons, swaps, operations }
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      swaps++;
      operations++;

      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [k],
        sortedIndices: [...sortedIndices],
        activeIndices: [k],
        description: `Wrote element ${arr[k]} into position ${k}.`,
        codeLine: 6,
        metrics: { comparisons, swaps, operations }
      });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      swaps++;
      operations++;
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [k],
        sortedIndices: [...sortedIndices],
        activeIndices: [k],
        description: `Flushing remaining left element ${left[i]} to index ${k}.`,
        codeLine: 6,
        metrics: { comparisons, swaps, operations }
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      swaps++;
      operations++;
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [k],
        sortedIndices: [...sortedIndices],
        activeIndices: [k],
        description: `Flushing remaining right element ${right[j]} to index ${k}.`,
        codeLine: 6,
        metrics: { comparisons, swaps, operations }
      });
      j++;
      k++;
    }

    if (low === 0 && high === arr.length - 1) {
      for (let idx = 0; idx < arr.length; idx++) {
        if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
      }
    }
  }

  function mergeSortHelper(low, high) {
    if (low >= high) return;
    const mid = Math.floor((low + high) / 2);

    steps.push({
      array: [...arr],
      comparing: [mid],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: [low, high],
      description: `Dividing range [${low}..${high}] at midpoint ${mid}.`,
      codeLine: 3,
      metrics: { comparisons, swaps, operations }
    });

    mergeSortHelper(low, mid);
    mergeSortHelper(mid + 1, high);
    merge(low, mid, high);
  }

  mergeSortHelper(0, arr.length - 1);

  const allSorted = arr.map((_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: allSorted,
    activeIndices: [],
    description: "Merge Sort completed successfully!",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  return steps;
}

// 5. Quick Sort
export function generateQuickSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [],
    activeIndices: [],
    description: "Starting Quick Sort (Divide and Conquer with Partitioning).",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sortedIndices: [...sortedIndices],
      activeIndices: [high],
      description: `Chosen pivot: ${pivot} at index ${high}.`,
      codeLine: 3,
      metrics: { comparisons, swaps, operations }
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      operations++;

      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [high],
        description: `Comparing element ${arr[j]} with pivot ${pivot}.`,
        codeLine: 3,
        metrics: { comparisons, swaps, operations }
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          operations += 2;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            array: [...arr],
            comparing: [],
            swapped: [i, j],
            sortedIndices: [...sortedIndices],
            activeIndices: [high],
            description: `Swapped ${arr[i]} at index ${i} with ${arr[j]} at index ${j} (smaller than pivot).`,
            codeLine: 3,
            metrics: { comparisons, swaps, operations }
          });
        }
      }
    }

    swaps++;
    operations += 2;
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    const pivotFinalIndex = i + 1;
    if (!sortedIndices.includes(pivotFinalIndex)) {
      sortedIndices.push(pivotFinalIndex);
    }

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [pivotFinalIndex, high],
      sortedIndices: [...sortedIndices],
      activeIndices: [pivotFinalIndex],
      description: `Placed pivot ${arr[pivotFinalIndex]} into its definitive position at index ${pivotFinalIndex}.`,
      codeLine: 3,
      metrics: { comparisons, swaps, operations }
    });

    return pivotFinalIndex;
  }

  function quickSortHelper(low, high) {
    if (low <= high) {
      if (low === high) {
        if (!sortedIndices.includes(low)) sortedIndices.push(low);
        return;
      }
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, arr.length - 1);

  const allSorted = arr.map((_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: allSorted,
    activeIndices: [],
    description: "Quick Sort finished! Array completely ordered.",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  return steps;
}

// 6. Heap Sort
export function generateHeapSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  const sortedIndices = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [],
    activeIndices: [],
    description: "Starting Heap Sort. Step 1: Build Max-Heap.",
    codeLine: 1,
    metrics: { comparisons, swaps, operations }
  });

  function heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      comparisons++;
      operations++;
      steps.push({
        array: [...arr],
        comparing: [left, largest],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [root],
        description: `Checking left child at index ${left} (${arr[left]}) against current largest (${arr[largest]}).`,
        codeLine: 4,
        metrics: { comparisons, swaps, operations }
      });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      operations++;
      steps.push({
        array: [...arr],
        comparing: [right, largest],
        swapped: [],
        sortedIndices: [...sortedIndices],
        activeIndices: [root],
        description: `Checking right child at index ${right} (${arr[right]}) against current largest (${arr[largest]}).`,
        codeLine: 4,
        metrics: { comparisons, swaps, operations }
      });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      swaps++;
      operations += 2;
      const temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;

      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [root, largest],
        sortedIndices: [...sortedIndices],
        activeIndices: [largest],
        description: `Swapped parent index ${root} with child index ${largest} to maintain heap property.`,
        codeLine: 4,
        metrics: { comparisons, swaps, operations }
      });

      heapify(size, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: [],
    activeIndices: [0],
    description: "Max-Heap successfully built! Root is maximum element.",
    codeLine: 2,
    metrics: { comparisons, swaps, operations }
  });

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    operations += 2;
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    sortedIndices.push(i);

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [0, i],
      sortedIndices: [...sortedIndices],
      activeIndices: [i],
      description: `Moved maximum element ${arr[i]} to sorted position index ${i}.`,
      codeLine: 3,
      metrics: { comparisons, swaps, operations }
    });

    heapify(i, 0);
  }

  sortedIndices.push(0);
  const allSorted = arr.map((_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sortedIndices: allSorted,
    activeIndices: [],
    description: "Heap Sort completed! Array fully sorted.",
    codeLine: 4,
    metrics: { comparisons, swaps, operations }
  });

  return steps;
}

export const SORTING_ALGORITHMS = {
  bubbleSort: {
    id: "bubbleSort",
    name: "Bubble Sort",
    category: "sorting",
    generator: generateBubbleSortSteps,
    bestTime: "O(n)",
    averageTime: "O(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    pseudocode: SORTING_PSEUDOCODE.bubbleSort,
  },
  selectionSort: {
    id: "selectionSort",
    name: "Selection Sort",
    category: "sorting",
    generator: generateSelectionSortSteps,
    bestTime: "O(n²)",
    averageTime: "O(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    description: "Finds the minimum element from the unsorted portion and swaps it with the leftmost unsorted element.",
    pseudocode: SORTING_PSEUDOCODE.selectionSort,
  },
  insertionSort: {
    id: "insertionSort",
    name: "Insertion Sort",
    category: "sorting",
    generator: generateInsertionSortSteps,
    bestTime: "O(n)",
    averageTime: "O(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    description: "Iteratively builds the sorted array one element at a time by inserting each element into its proper position.",
    pseudocode: SORTING_PSEUDOCODE.insertionSort,
  },
  mergeSort: {
    id: "mergeSort",
    name: "Merge Sort",
    category: "sorting",
    generator: generateMergeSortSteps,
    bestTime: "O(n log n)",
    averageTime: "O(n log n)",
    worstTime: "O(n log n)",
    space: "O(n)",
    stable: true,
    inPlace: false,
    description: "Divide and conquer algorithm that splits array into halves, recursively sorts them, and merges sorted subarrays.",
    pseudocode: SORTING_PSEUDOCODE.mergeSort,
  },
  quickSort: {
    id: "quickSort",
    name: "Quick Sort",
    category: "sorting",
    generator: generateQuickSortSteps,
    bestTime: "O(n log n)",
    averageTime: "O(n log n)",
    worstTime: "O(n²)",
    space: "O(log n)",
    stable: false,
    inPlace: true,
    description: "Picks a pivot element and partitions the array such that elements smaller than pivot go left and larger go right.",
    pseudocode: SORTING_PSEUDOCODE.quickSort,
  },
  heapSort: {
    id: "heapSort",
    name: "Heap Sort",
    category: "sorting",
    generator: generateHeapSortSteps,
    bestTime: "O(n log n)",
    averageTime: "O(n log n)",
    worstTime: "O(n log n)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    description: "Builds a binary max-heap from the array, then repeatedly extracts the root maximum to the end of the array.",
    pseudocode: SORTING_PSEUDOCODE.heapSort,
  }
};
