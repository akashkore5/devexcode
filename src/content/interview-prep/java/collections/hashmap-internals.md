
HashMap in Java works on the principle of **Hashing**. It uses an array of buckets (Nodes) to store entries.

### Key Components:
1. **Hashing**: Uses `hashCode()` to find the bucket index.
2. **Equals**: Uses `equals()` to find the exact key in case of collisions.
3. **Collisions**: In Java 8, if a bucket has more than 8 elements, the Linked List is converted into a **Balanced Tree (Red-Black Tree)** to improve search performance from O(n) to O(log n).

### Put Operation:
1. Calculate hash of key.
2. Find index: `index = hash & (n-1)`.
3. If bucket is empty, create new node.
4. If collision occurs, traverse the list/tree and replace if key exists, or add to end.
ok
