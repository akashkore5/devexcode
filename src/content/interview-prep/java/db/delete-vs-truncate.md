---
title: "DELETE vs TRUNCATE."
category: "db"
order: 1
---

| Feature | DELETE | TRUNCATE |
| :--- | :--- | :--- |
| **Command Type** | DML (Data Manipulation) | DDL (Data Definition) |
| **WHERE clause** | Supported (can delete specific rows) | Not Supported (deletes all rows) |
| **Performance** | Slower (logs each row deletion) | Faster (deallocates pages) |
| **Rollback** | Possible | Not possible (generally) |
| **Auto-increment** | Does not reset | Resets to 1 |
