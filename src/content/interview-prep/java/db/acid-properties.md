---
title: "ACID Properties in Databases"
category: "db"
order: 15
status: "not-started"
tags: ["SQL", "Transactions", "Architecture", "Data Integrity"]
---

# 🔹 ACID Properties in Databases (Deep Dive, Interview-Ready)

"Explain the ACID properties" is perhaps the most fundamental theoretical question asked in database interviews. While reciting the acronym is easy, explaining the underlying architectural mechanics (like WAL logs and Locking) separates senior candidates from juniors.

---

## 📌 1. A - Atomicity ("All or Nothing")

Atomicity guarantees that a transaction is treated as a single, indivisible unit of work. If a transaction contains 5 separate SQL statements, either all 5 succeed, or all 5 fail and the database rolls back to its exact previous state.

### 🔸 Real-World Example
A bank transfer from Account A to Account B requires two steps:
1. Deduct $100 from A.
2. Add $100 to B.
If the database crashes between step 1 and 2, Atomicity ensures the $100 isn't permanently lost; step 1 is rolled back.

### 🔸 How the DB achieves it:
Relational databases use a **Transaction Log** (often called the Write-Ahead Log, or WAL). Before making permanent changes to the data files, the engine writes the intended change to the log. If a crash happens mid-transaction, upon reboot, the database reads the log and reverses any incomplete transactions.

---

## 📌 2. C - Consistency (Rule Enforcement)

Consistency ensures that a transaction can only bring the database from one valid state to another valid state. It guarantees that all predefined database rules (Constraints, Triggers, Cascades) are strictly enforced.

### 🔸 Real-World Example
If your database has a `FOREIGN KEY` constraint that an `Employee` must belong to a valid `Department`, you cannot delete a department if employees still belong to it. The transaction will be rejected to maintain consistency.

### 🔸 How the DB achieves it:
Through the active enforcement of **Primary Keys, Foreign Keys, CHECK constraints, and UNIQUE constraints** at the schema level.

---

## 📌 3. I - Isolation (Invisible Intersections)

Isolation ensures that concurrent transactions execute independently without interfering with each other. Even if 1,000 users are hitting the database at the same time, the end result should be the same as if the transactions were executed sequentially, one after the other.

### 🔸 Real-World Example
Two users try to buy the last airplane ticket at the exact same millisecond. Isolation ensures that User 1's transaction locks the ticket, forcing User 2's transaction to wait or fail. They don't both get a "Success" message for the same seat.

### 🔸 How the DB achieves it:
Through **Locking Mechanisms** (Row-level, Page-level, Table-level locks) and **Concurrency Control** algorithms (like MVCC - Multi-Version Concurrency Control). You can tune this behavior using *Isolation Levels* (Read Uncommitted, Read Committed, Repeatable Read, Serializable).

---

## 📌 4. D - Durability (Permanent Survival)

Durability guarantees that once a transaction has been successfully committed, it will survive permanently, even in the event of a total system failure, power loss, or crash.

### 🔸 Real-World Example
You book a hotel. You see the confirmation screen. One second later, the database server loses power. When the server restarts, your booking must still exist.

### 🔸 How the DB achieves it:
Before a transaction is officially marked as "Committed", the database forces the Write-Ahead Log (WAL) to be physically flushed (written) from RAM directly onto the persistent Hard Drive (SSD/HDD). Even if RAM is wiped in a power cut, the hard drive has the log to recreate the data upon reboot.

---

## 🔥 Interview Gold Statement

> *"The ACID properties are the bedrock of relational database reliability. **Atomicity** ensures an 'all-or-nothing' execution of transactions using Write-Ahead Logs. **Consistency** guarantees that schema-level rules, like constraints and triggers, are strictly enforced, moving the database between valid states. **Isolation** utilizes locking mechanisms and MVCC to ensure concurrent transactions don't corrupt each other's data, preventing issues like dirty reads. Finally, **Durability** guarantees that once a commit is acknowledged, the transaction is physically flushed to non-volatile storage and will survive any immediate hardware failure."*
