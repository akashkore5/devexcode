---
title: "What are happens-before relationships in JMM?"
category: "fundamentals"
order: 5
---

The **Happens-Before** principle is a formal guarantee that memory writes by one specific statement are visible to another specific statement.

### Key Rules:
1. **Program Order Rule**: Actions in a single thread happen according to code order.
2. **Monitor Lock Rule**: An unlock on a monitor happens-before every subsequent lock on that same monitor.
3. **Volatile Variable Rule**: A write to a volatile field happens-before every subsequent read of that same field.
4. **Thread Start Rule**: A call to `Thread.start()` happens-before any action in the started thread.
5. **Thread Termination Rule**: Any action in a thread happens-before any other thread detects that thread has terminated.
