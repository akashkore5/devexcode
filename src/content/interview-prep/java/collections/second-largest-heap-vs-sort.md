---
title: "Find the second largest element in an array and analyze time complexity between heap and sorting."
category: "collections"
order: 22
---

### Approach 1: Sorting
```java
Arrays.sort(arr);
int secondLargest = arr[arr.length - 2];
```
- **Time**: O(n log n) — full sort is overkill for just the second largest.
- **Space**: O(1) for in-place sorts (e.g., Arrays.sort uses dual-pivot quicksort).
- **Drawback**: Mutates the original array.

### Approach 2: Min-Heap of size 2
```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>(2);
for (int num : arr) {
    minHeap.offer(num);
    if (minHeap.size() > 2) minHeap.poll();
}
int secondLargest = minHeap.peek();
```
- **Time**: O(n log k) where k=2, so effectively **O(n)**.
- **Space**: O(k) = O(1).
- **Advantage**: Does not mutate the array.

### Approach 3: Single Pass (Optimal)
```java
int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
for (int num : arr) {
    if (num > first) { second = first; first = num; }
    else if (num > second && num != first) { second = num; }
}
```
- **Time**: O(n) — single traversal.
- **Space**: O(1).

### Complexity Comparison

| Approach | Time | Space | Mutates Array? |
|----------|------|-------|----------------|
| Sorting | O(n log n) | O(1) | Yes |
| Min-Heap (k=2) | O(n) | O(1) | No |
| Single Pass | O(n) | O(1) | No |

### Interview Insight
For finding the **k-th largest** element generically, a **Max-Heap** or **Quickselect** (O(n) average) is preferred. For just the second largest, the single-pass approach is optimal and demonstrates strong algorithmic thinking.
