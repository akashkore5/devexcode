---
title: "Primary, Candidate, and Surrogate Keys"
category: "db"
order: 23
status: "not-started"
tags: ["SQL", "Database Design", "Architecture", "Keys"]
---

# 🔹 Database Keys Architecture (Deep Dive, Interview-Ready)

"Explain the difference between a Candidate Key and a Primary Key" is a classic relational modeling question. To stand out, you need to extend this answer into the architectural debate between **Natural Keys** and **Surrogate Keys**.

---

## 📌 1. The Key Hierarchy

### 🔸 Candidate Key
A **Candidate Key** is any single column (or combination of columns) that can uniquely identify a row in a table. It cannot contain `NULL` values. 
A table can have **multiple** Candidate Keys. 

*Example:* In a `Users` table, `SSN`, `Email_Address`, and `Employee_ID` could all theoretically guarantee uniqueness. All three are Candidate Keys.

### 🔸 Primary Key
A **Primary Key (PK)** is simply the one Candidate Key that the database architect *chooses* to be the official, primary method of identifying a row. 
* A table can have **only one** Primary Key.
* Under the hood, assigning a Primary Key usually forces the database to create a **Clustered Index** on that column, which physically sorts the table data on disk based on that key.

### 🔸 Alternate Key
Any Candidate Key that was *not* chosen to be the Primary Key becomes an **Alternate Key**. You typically enforce these by placing a `UNIQUE` constraint on the column.

---

## 📌 2. Natural vs. Surrogate Keys (The Real Interview Question)

Once you define a Primary Key, the interviewer will ask: *"Should you use a natural attribute (like an Email or SSN) as your Primary Key, or generate an artificial one?"*

### 🔸 Natural Key
A Natural Key is a Primary Key made of data that has real-world business meaning (e.g., an `Email_Address` or a `Vehicle_Identification_Number`).
* **Pros:** Prevents duplicate real-world entries easily.
* **Cons (The Trap):** Real-world data changes. What if a user changes their email address? If `Email` is your Primary Key, you now have to cascade that update to every single foreign key table (Orders, Logs, Profiles) that references it. This is a locking and performance nightmare. Also, strings make terrible clustered indexes because they are large and slow to sort.

### 🔸 Surrogate Key (Best Practice)
A Surrogate Key is a system-generated, artificial identifier that has zero business meaning (e.g., an auto-incrementing integer `id` or a `UUID`). 
* **Pros:** It never changes. If a user changes their email, you only update the `email` column; the `id` stays the same, so no foreign keys need to be updated. Furthermore, sequential integers (`AUTO_INCREMENT` / `SERIAL`) are the absolute fastest data types for B-Tree indexing and `JOIN` operations.
* **Cons:** It doesn't prevent business logic duplicates natively. You must add a `UNIQUE` constraint on the `email` column to prevent two users from registering the same email.

---

## 📌 3. What happens if a table has NO Primary Key?

It is technically possible to create a table without a Primary Key, but it is considered a **severe anti-pattern**.
1. **Performance Collapse:** Without a Primary Key, there is typically no Clustered Index. The data is stored in an unsorted "Heap." Any search requires a Full Table Scan.
2. **Duplicate Nightmare:** There is no structural guarantee of uniqueness, making data corruption almost inevitable.
3. **No Relationships:** You cannot safely create Foreign Key relationships from other tables to a heap table.

---

## 🔥 Interview Gold Statement

> *"A Candidate Key is any column or set of columns that uniquely identifies a row without nulls. The Primary Key is simply the one Candidate Key selected by the architect to officially identify the records, physically driving the table's clustered index. In modern database design, we strongly prefer 'Surrogate Keys'—meaningless, system-generated integers like an auto-incrementing ID—over 'Natural Keys' like an email or SSN. Surrogate keys never change, preventing cascading foreign-key update nightmares, and integers are vastly faster for B-Tree indexing and joins. We then enforce business uniqueness by applying UNIQUE constraints on the natural alternate keys."*
