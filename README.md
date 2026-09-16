# LogicForge

> **Forge HDL into Hardware.**  
> Lightweight, Vendor-Neutral, Cross-Platform FPGA Development Environment.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Monorepo Structure](#architecture--monorepo-structure)
- [Quick Start](#quick-start)
  - [One-Click Windows Launcher](#one-click-windows-launcher)
  - [Command Line Interface (CLI)](#command-line-interface-cli)
- [Monorepo Package Breakdown](#monorepo-package-breakdown)
- [RTL Intelligence & Analysis Engines](#rtl-intelligence--analysis-engines)
- [Toolchain Integration & Backend Matrix](#toolchain-integration--backend-matrix)
- [Supported FPGA Families & Hardware Boards](#supported-fpga-families--hardware-boards)
- [Headless CI/CD Pipeline Automation](#headless-cicd-pipeline-automation)
- [Documentation Index](#documentation-index)
- [License & Attributions](#license--attributions)

---

## Overview

**LogicForge** is an independent, lightweight, open-source FPGA development environment designed to provide a cohesive engineering workflow from initial Verilog/SystemVerilog RTL authoring through simulation, synthesis, place & route, timing closure, resource analysis, digital waveform inspection, IP integration, block design, formal verification, hardware programming, and on-chip UART debugging.

### What LogicForge Is Not
- **NOT** a bloated multi-gigabyte proprietary vendor IDE clone.
- **NOT** reliant on fake simulation results, fabricated hardware connections, or mock tool outputs.
- **NOT** tied to proprietary vendor algorithms or locked databases.

### Core Philosophy
1. **Zero Friction Launcher**: A self-bootstrapping entry point (`launch_logicforge.bat`) that automatically handles Node.js dependencies, self-heals builds, and detects toolchains without requiring manual PATH tinkering.
2. **Progressive Disclosure UI**: A intuitive surface for beginners, backed by deep analysis tools (CDC, FSM, Reset, Timing Slack, Package Pin Planner, Formal Verification) for experienced hardware engineers.
3. **Vendor-Neutral & Scriptable**: Uniform orchestration layer for open-source toolchains (`Yosys`, `Icarus Verilog`, `Verilator`, `nextpnr-ice40`, `nextpnr-ecp5`, `openFPGALoader`). Fully reproducible via headless CLI (`logicforge`) and deterministic build manifests (`logicforge.json` and `logicforge.lock`).

---

## Key Features

- **🚀 One-Click Launcher (`launch_logicforge.bat`)**: Automatic prerequisite detection (Node.js, npm), auto-installation via `winget`, self-healing workspace package compilation, toolchain discovery, and startup logging (`logs/startup.log`).
- **💻 Desktop IDE Shell**: Professional engineering IDE built with React 18 & TypeScript featuring dark technical styling, tabbed workspaces, dockable console logs, and quick command execution.
- **🔍 Static RTL Intelligence**: Built-in linting (`LF-LINT-001` latch detection, `LF-LINT-002` bus width mismatches, `LF-LINT-004` undriven wires) with automated quick-fix recommendations.
- **⚙️ FSM & CDC Analysis Engines**: Automated extraction of state machine encodings and transition matrices (`FSMService`), unsynchronized clock domain crossing diagnostics (`CDCService`), and reset domain mapping (`ResetService`).
- **📊 Interactive Digital Waveform Viewer**: Native VCD waveform parser with canvas-rendered signals, configurable radix (Hex, Binary, Decimal, ASCII), zoom controls, and time cursor measurements.
- **📐 RTL Schematic Visualizer**: Interactive node-graph renderer parsing Yosys JSON netlists into clickable module blocks, logic gates, and flip-flops.
- **⏱️ Timing Slack & Resource Utilization**: Detailed Worst Negative Slack (WNS) evaluation, clock frequency achievement calculation, cell usage breakdown (LUT4, Flip-Flops, BRAM, DSP, I/O), and build-over-build delta comparison (`ResourceTrendingService`).
- **🧩 Parameterized IP Catalog & Block Design**: Rapid core generator for Synchronous FIFOs, UART Transceivers, PWM Generators, and Timers, alongside a visual block design canvas emitting clean RTL wrappers.
- **🔌 Package Pin Planner & Constraint Matrix**: Pin mapping table synchronized with XDC/SDC constraint files for I/O standard selection (LVCMOS33, LVCMOS25, LVCMOS18), drive strength, and pullups.
- **🛠️ Hardware Manager & Integrated Serial Terminal**: Hardware probe discovery, JTAG/SPI bitstream flashing via `openFPGALoader`, and an integrated UART console supporting 9600, 115200, and 230400 baud rates.
- **🔒 Reproducible Build Fingerprinting**: SHA256 build artifact hashing, deterministic lockfile generation (`logicforge.lock`), and formal property proof checking (`FormalService`).

---

## Architecture & Monorepo Structure

```text
┌─────────────────────────────────────────────────────────┐
│                   LogicForge Desktop UI                 │
│         (React 18 / TypeScript / Design System)         │
├─────────────────────────────────────────────────────────┤
│                  Application Workspaces                 │
│  Design │ Sim │ Synth │ PnR │ Timing │ HW │ IP │ Formal   │
├─────────────────────────────────────────────────────────┤
│                   Application Services                  │
│ WorkspaceService │ QuickFixService │ PluginService      │
│ DebugArchitectureService │ HardwareTestService          │
├─────────────────────────────────────────────────────────┤
│               Core Design & Analysis Engines            │
│  DesignGraphService │ FSMService │ CDCService │ Reset   │
│  ResourceAnalysisService │ TimingService │ IPService    │
├─────────────────────────────────────────────────────────┤
│                   Project / DAG Engine                  │
│ ProjectManager │ DAGBuildEngine │ ProjectPackager      │
├─────────────────────────────────────────────────────────┤
│               Toolchain & Backend Adapters              │
│ IcarusBackend │ YosysBackend │ NextpnrBackend │ Flasher │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

### One-Click Windows Launcher

Simply double-click the root batch launcher:

```text
launch_logicforge.bat
```

The launcher automatically:
1. Validates system environment (Windows, Node.js v18+, npm).
2. Prompts and installs missing Node.js dependencies via `winget` if required.
3. Compiles workspace packages if build targets are missing (`npx tsc -b`).
4. Detects installed FPGA toolchains (`iverilog`, `yosys`, `nextpnr`, `openFPGALoader`).
5. Launches the **LogicForge Desktop IDE** locally at `http://localhost:3000`.

### Command Line Interface (CLI)

You can also run LogicForge in headless CI mode or via terminal commands:

```bash
# Install workspace dependencies
npm install

# Build all monorepo packages
npm run build

# Run full automated test suite (26 test suites)
npm test

# Create a new FPGA project
node apps/cli/bin/logicforge.js create --name blink_project --template blink

# Run RTL linting & static analysis
node apps/cli/bin/logicforge.js lint --project blink_project/logicforge.json

# Run simulation via Icarus Verilog
node apps/cli/bin/logicforge.js simulate --project blink_project/logicforge.json

# Run synthesis via Yosys
node apps/cli/bin/logicforge.js synth --project blink_project/logicforge.json

# Run Place & Route via nextpnr
node apps/cli/bin/logicforge.js implement --project blink_project/logicforge.json

# Run complete build pipeline (Simulate -> Synth -> PnR -> Bitstream)
node apps/cli/bin/logicforge.js build --project blink_project/logicforge.json

# Program connected FPGA hardware
node apps/cli/bin/logicforge.js program --project blink_project/logicforge.json

# Environment Doctor & Toolchain Inspection
node apps/cli/bin/logicforge.js doctor
```

---

## Monorepo Package Breakdown

LogicForge is organized as a clean TypeScript monorepo using npm workspaces:

| Package / Application | Path | Description |
|---|---|---|
| `@logicforge/core` | [`packages/core`](file:///c:/PROJECTS/LogicForge/packages/core) | Core domain models, DAG build engine, AST design graph, FSM/CDC/Reset services, timing analyzer, IP core generator, and workspace layout manager. |
| `@logicforge/toolchain` | [`packages/toolchain`](file:///c:/PROJECTS/LogicForge/packages/toolchain) | Executable tool discovery (`ToolDetector`), version parsing, subprocess isolation runner, and log error parsers. |
| `@logicforge/backends` | [`packages/backends`](file:///c:/PROJECTS/LogicForge/packages/backends) | Vendor-neutral backend adapters (`IcarusBackend`, `YosysBackend`, `NextpnrBackend`, `IcepackBackend`, `OpenFPGALoaderBackend`). |
| `@logicforge/waveform` | [`packages/waveform`](file:///c:/PROJECTS/LogicForge/packages/waveform) | Native Value Change Dump (`.vcd`) wave parser and rendering engine. |
| `@logicforge/schematic` | [`packages/schematic`](file:///c:/PROJECTS/LogicForge/packages/schematic) | Netlist parser (`NetlistParser`) converting Yosys JSON netlists into layout nodes and edges for schematic visualization. |
| `@logicforge/constraints` | [`packages/constraints`](file:///c:/PROJECTS/LogicForge/packages/constraints) | XDC/SDC constraint parser (`ConstraintAdapter`) for pin mappings, clock definitions, and I/O standards. |
| `@logicforge/editor` | [`packages/editor`](file:///c:/PROJECTS/LogicForge/packages/editor) | Code diagnostics engine, syntax highlighting helpers, and editor model definitions. |
| `@logicforge/cli` | [`apps/cli`](file:///c:/PROJECTS/LogicForge/apps/cli) | Headless command line executable supporting JSON output for CI automation (`logicforge`). |
| `@logicforge/desktop` | [`apps/desktop`](file:///c:/PROJECTS/LogicForge/apps/desktop) | React 18 desktop IDE interface with multi-tab workspace shell and integrated dev server (`bin/dev.js`). |

---

## RTL Intelligence & Analysis Engines

LogicForge features advanced static code and netlist analysis tools:

- **HDLLintService**: Evaluates Verilog source code for structural design flaws:
  - `LF-LINT-001`: Incomplete combinational assignments causing inferred latches.
  - `LF-LINT-002`: Bitwidth mismatches between assignment LHS and RHS expressions.
  - `LF-LINT-004`: Declared wires or registers with no driving source.
- **FSMService**: Extracts state registers, state enum values, transition tables, and unreachable state warnings.
- **CDCService**: Identifies asynchronous signals crossing clock domains without multi-stage synchronizers (`LF-CDC-001`).
- **ResetService**: Maps synchronous and asynchronous reset trees, identifying un-reset registers (`RESET-001`).
- **TimingService**: Calculates clock period constraints against actual achieved delay paths, reporting Worst Negative Slack (WNS) and setup/hold violations.
- **ResourceAnalysisService & ResourceTrendingService**: Parses primitive cell instances (LUT4, DFF, BRAM, DSP) and tracks resource utilization deltas across build revisions.

---

## Toolchain Integration & Backend Matrix

LogicForge orchestrates open-source EDA tools without vendor lock-in:

| Toolchain / Backend | Purpose | Status Classification | Supported Targets |
|---|---|---|---|
| **Icarus Verilog** (`iverilog` / `vvp`) | Simulation | `VERIFIED` | Standard Verilog (IEEE 1364) |
| **Yosys** (`yosys`) | Logic Synthesis | `VERIFIED` | Lattice iCE40, Lattice ECP5, Generic Synthesis |
| **nextpnr-ice40** | Place & Route | `VERIFIED` | Lattice iCE40 (HX1K, HX8K, LP1K, LP8K) |
| **nextpnr-ecp5** | Place & Route | `VERIFIED` | Lattice ECP5 (25F, 45F, 85F) |
| **Icepack / Ecppack** | Bitstream Packaging | `VERIFIED` | iCE40 (`.bin`), ECP5 (`.bit`) |
| **openFPGALoader** | FPGA Programming | `TOOL_DEPENDENT` | FTDI (FT2232H, FT232H), JTAG, SPI |
| **SymbiYosys** (`sby`) | Formal Verification | `TOOL_DEPENDENT` | SMT-BMC, BMC, Proof |
| **Gowin GW1N** | Synthesis / PnR | `EXPERIMENTAL` | Tang Nano Series (GW1NR-9) |

---

## Supported FPGA Families & Hardware Boards

LogicForge includes built-in board definitions and device parameter tables (`BoardRegistry` and `DeviceSearchService`):

- **Lattice iCEstick**: `iCE40HX1K-TQ144` (1,280 LUTs, 16 BRAMs, 96 I/O pins)
- **iCE40-HX8K Breakout**: `iCE40HX8K-CT256` (7,680 LUTs, 32 BRAMs, 206 I/O pins)
- **Lattice ECP5 5G EVN**: `LFE5UM5G-85F-8BG381C` (84,000 LUTs, 208 BRAMs, 156 DSPs)
- **Tang Nano 9K**: `GW1NR-LV9QN88PC6/I5` (8,640 LUTs, 26 BRAMs, 10 DSPs)

---

## Headless CI/CD Pipeline Automation

Integrate LogicForge directly into GitHub Actions, GitLab CI, or Jenkins pipelines using the CLI with machine-readable JSON flags:

```bash
# Validate project manifest and RTL syntax
node apps/cli/bin/logicforge.js validate --project logicforge.json --json

# Run headless simulation & fail pipeline on testbench error
node apps/cli/bin/logicforge.js simulate --project logicforge.json --ci

# Run full synthesis -> implementation build pipeline in CI mode
node apps/cli/bin/logicforge.js build --project logicforge.json --ci

# Generate consolidated JSON report for artifact archival
node apps/cli/bin/logicforge.js ci-report --json
```

---

## Documentation Index

- 📘 [Quickstart Guide](QUICKSTART.md) — 2-minute setup and launcher guide.
- 📖 [User Manual](docs/USER_MANUAL.md) — Comprehensive guide to all IDE workspaces and analysis engines.
- 🔧 [Toolchain Setup Guide](docs/TOOLCHAIN_SETUP.md) — Installation instructions for Yosys, nextpnr, and Icarus Verilog.
- 🔌 [Board Setup & Driver Guide](docs/BOARD_SETUP.md) — USB/FTDI Zadig driver configuration guide for FPGA hardware.
- ❓ [Troubleshooting & FAQ](docs/TROUBLESHOOTING.md) — Diagnostic assistance and common questions.
- 📋 [Capabilities Matrix](docs/CAPABILITIES.md) — Machine & human-readable capability classification.
- 📜 [Release v1.0.0 Notes](docs/RELEASE_v1.0.0.md) — Official release notes and baseline specs.
- 🛠️ [Phase Audit Document](docs/PHASE_8_AUDIT.md) — Verification audit classification.
- 🔍 [HDL Linting Guide](docs/LINTING.md) — Lint rules and diagnostic reference.
- 📦 [IP Core Generator Guide](docs/IP.md) — Parameterized IP catalog documentation.
- 🧩 [Block Design Guide](docs/BLOCK_DESIGN.md) — Topological block designer documentation.
- 🛡️ [Formal Verification Guide](docs/FORMAL.md) — SymbiYosys proof verification guide.

---

## License & Attributions

LogicForge is licensed under the [Apache License 2.0](LICENSE).  
Third-party licenses for underlying open-source tools and components are documented in [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES).
