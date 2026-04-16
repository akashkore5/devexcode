---
title: "Explain JVM architecture and components (Class Loader, Runtime Data Areas, Execution Engine)."
category: "fundamentals"
order: 2
---

### 1. Class Loader Subsystem
- **Loading**: BootStrap, Extension, and Application ClassLoaders.
- **Linking**: Verify, Prepare, Resolve.
- **Initialization**: Static variables assigned original values.

### 2. Runtime Data Areas
- **Method Area / Metaspace**: Class-level data (Global).
- **Heap Area**: Objects and instance variables (Global).
- **Stack Area**: Method calls and local variables (Thread-specific).
- **PC Registers**: Address of current instruction (Thread-specific).
- **Native Method Stack**: Native function calls (Thread-specific).

### 3. Execution Engine
- **Interpreter**: Reads bytecode and executes.
- **JIT Compiler**: Compiles high-frequency bytecode to native machine code.
- **Garbage Collector**: Reclaims heap memory.
