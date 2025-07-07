**Title:** What is a Segment Tree?
**SEO Keywords:** segment tree, binary indexed tree, range query, interval tree, data structure

**Intro:**
In the world of algorithms and data structures, there are many fascinating tools that can help us solve complex problems efficiently. One such tool is the segment tree, also known as a binary indexed tree or interval tree. In this post, we'll dive into what a segment tree is, how it works, and why you should care.

**Main Blog Content:**
A segment tree is a data structure that allows for efficient range queries over an array of values. It's commonly used in applications where you need to perform aggregation operations or find the minimum/maximum value within a specific range. Imagine having a large dataset of temperature readings, and you want to quickly answer questions like "What was the average temperature between 10:00 AM and 11:00 AM?" or "What was the highest temperature recorded in the last hour?"

A segment tree is built by recursively dividing the input array into smaller segments, each representing a contiguous range of values. Each node in the tree stores the minimum/maximum value (depending on the type of query) within its corresponding range. This allows for fast queries by traversing the tree from top to bottom, aggregating values as you go.

Here's an ASCII diagram to illustrate this:
```
       +---------------+
       |  Root Node   |
       +---------------+
                  |
                  |
       +---------------+
       | Segment [0-3]  |
       | (Min: 1, Max: 5) |
       +---------------+
                  |
                  |
       +---------------+
       | Segment [0-1]  |
       | (Min: 1, Max: 3) |
       +---------------+
                  |
                  |
       +---------------+
       | Segment [2-3]  |
       | (Min: 4, Max: 5) |
       +---------------+
```
In this example, the root node represents the entire input array. The middle nodes represent smaller segments within that range. Each node stores the minimum and maximum values within its segment.

**TL;DR:** A segment tree is a data structure used for efficient range queries over an array of values. It's built by recursively dividing the input array into smaller segments, each storing the minimum/maximum value within its range. This allows for fast aggregation operations or finding min/max values within specific ranges.