# LogicForge — User Manual (v1.0.0)

Welcome to the official User Manual for **LogicForge**, an independent, vendor-neutral FPGA development environment.

---

## Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [Installation & Launcher](#2-installation--launcher)
3. [Desktop Navigation & UI Modes](#3-desktop-navigation--ui-modes)
4. [RTL Design & Editing](#4-rtl-design--editing)
5. [Simulation & Waveform Analysis](#5-simulation--waveform-analysis)
6. [Synthesis, Implementation & PnR](#6-synthesis-implementation--pnr)
7. [Timing & Resource Analysis](#7-timing--resource-analysis)
8. [RTL Intelligence (FSM, CDC, Reset)](#8-rtl-intelligence-fsm-cdc-reset)
9. [IP Catalog & Block Design](#9-ip-catalog--block-design)
10. [Pin Planning & Constraints](#10-pin-planning--constraints)
11. [Hardware Manager & Serial Monitor](#11-hardware-manager--serial-monitor)
12. [Toolchain Manager](#12-toolchain-manager)

---

## 1. Overview & Architecture

LogicForge provides a unified, fast workflow for FPGA engineering without requiring multi-gigabyte proprietary vendor IDEs.

```text
┌─────────────────────────────────────────────────────────┐
│                   LogicForge Desktop                    │
├─────────────────────────────────────────────────────────┤
│ Design │ Sim │ Synth │ PnR │ Timing │ HW │ IP │ Formal     │
├─────────────────────────────────────────────────────────┤
│                       Core Services                     │
│   DAG Engine │ Linting │ Resource Analyst │ Hardware    │
├─────────────────────────────────────────────────────────┤
│                      Backend Tools                      │
│ Icarus Verilog │ Yosys │ nextpnr │ openFPGALoader       │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Installation & Launcher

LogicForge includes a self-bootstrapping launcher: `launch_logicforge.bat`.

### Launcher Features
- Automatically checks for Node.js (v18+) and npm.
- Offers automatic `winget` installation if Node.js is missing.
- Self-heals missing `node_modules` and TypeScript build targets.
- Inspects system PATH for FPGA backends (`iverilog`, `yosys`, `nextpnr`, `openFPGALoader`).
- Logs startup history to `logs/startup.log`.

---

## 3. Desktop Navigation & UI Modes

LogicForge features progressive disclosure:
- **Beginner Mode**: Simple controls for project creation, simulation, synthesis, and programming.
- **Advanced Mode**: Access to CDC analysis, FSM state graphs, reset domain trees, formal verification, block design canvas, and build comparison matrices.

---

## 4. RTL Design & Editing

- **RTL Hierarchy**: Navigate modules, sub-instances, and pin definitions.
- **HDL Diagnostics**: Built-in linting detects latches (`LF-LINT-001`), bitwidth mismatches (`LF-LINT-002`), and undriven signals (`LF-LINT-004`).

---

## 5. Simulation & Waveform Analysis

- **Engine**: Powered by Icarus Verilog / Verilator.
- **Waveform Viewer**: GPU-accelerated VCD rendering with interactive cursors, multi-radix support (Hex, Binary, Decimal), and zoom controls.

---

## 6. Synthesis, Implementation & PnR

- **Synthesis**: Yosys netlist generation.
- **Place & Route**: nextpnr (iCE40 / ECP5 architectures).
- **Bitstream Generation**: Icepack / Ecppack generation with SHA256 build fingerprints.

---

## 7. Timing & Resource Analysis

- **Timing Slack**: Evaluates Worst Negative Slack (WNS) and Total Negative Slack (TNS).
- **Resource Utilization**: Real-time breakdown of LUT4, Flip-Flops, BRAM, and DSP utilization.

---

## 8. RTL Intelligence (FSM, CDC, Reset)

- **FSM Analysis**: Automatically extracts state machines, state transition diagrams, and unreachable states.
- **CDC Analysis**: Identifies unsynchronized clock domain crossings.
- **Reset Analysis**: Maps synchronous vs. asynchronous reset domains.

---

## 9. IP Catalog & Block Design

- **Parameterized IP**: Generate FIFOs, UARTs, PWMs, and timers with clean Verilog output.
- **Block Design**: Drag-and-drop topological interconnect canvas with automatic RTL wrapper generation.

---

## 10. Pin Planning & Constraints

- **Pin Planner**: Visual Package Pin table synchronized with XDC/SDC constraint files.
- **I/O Standards**: Configure LVCMOS33, LVCMOS25, LVCMOS18, drive strengths, and pullups.

---

## 11. Hardware Manager & Serial Monitor

- **Hardware Discovery**: Automatic USB/JTAG probe detection.
- **Bitstream Flashing**: One-click programming via `openFPGALoader`.
- **Integrated UART Terminal**: Real-time serial debugging with configurable baud rates (9600, 115200, 230400).

---

## 12. Toolchain Manager

Inspect and configure local paths for external compilers and synthesis engines. Missing optional tools do not block IDE execution.

