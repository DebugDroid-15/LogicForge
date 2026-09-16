# LogicForge Phase 5 — Advanced Design Intelligence & Production Workflows

LogicForge Phase 5 elevates the environment into a comprehensive, production-oriented FPGA engineering platform featuring real RTL AST graph generation, state machine extraction, clock & reset domain diagnostics, resource utilization trending, testbench management, and provenance tracking.

## Core Services Added in Phase 5

### 1. AST Design Graph Service (`DesignGraphService`)
* Builds structural design graphs representing modules, instances, ports, signals, clocks, and memory blocks.
* Exposes hierarchy navigation and fanout/fanin query methods.

### 2. State Machine Extractor (`FSMService`)
* Identifies state register declarations, state encodings (Binary, One-Hot, Gray), state transitions, and condition branches.

### 3. Clock & Reset Domain Analyzer (`CDCService`, `ResetService`)
* Detects unsynchronized cross-domain register sampling (`LF-CDC-001`).
* Analyzes asynchronous reset de-assertion release conditions (`RESET-001`).

### 4. Resource Utilization & Trending (`ResourceAnalysisService`, `ResourceTrendingService`)
* Parses primitive cell counts (LUT4, DFF, BRAM) from synthesis reports.
* Computes build-over-build resource deltas (`compare-build`).

## CLI Subcommands Supported

```bash
logicforge analyze --json
logicforge fsm --json
logicforge cdc --json
logicforge reset --json
logicforge resources --json
```

