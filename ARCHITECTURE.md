# LogicForge Architecture & Technical Design Specification

LogicForge is a lightweight, modern, cross-platform FPGA development environment designed as an extensible orchestration, simulation, synthesis, analysis, and visualization platform around open-source and vendor FPGA toolchains.

---

## 1. Core Architectural Layers

```text
┌─────────────────────────────────────────────────────────┐
│                    LogicForge Desktop UI                │
│       (React 18 / TypeScript / Custom Design System)    │
├─────────────────────────────────────────────────────────┤
│                  Application Workspaces                 │
│ (Design | Simulation | Build | Implementation | HW)     │
├─────────────────────────────────────────────────────────┤
│                   Application Services                  │
│  (Event Bus | Diagnostics Engine | Build Manager)       │
├─────────────────────────────────────────────────────────┤
│                   Project / DAG Engine                  │
│    (Manifest Parser | Incremental Cache | Hierarchy)   │
├─────────────────────────────────────────────────────────┤
│               Toolchain & Backend Layer                 │
│ (Tool Discovery | Subprocess Isolation | Log Parsers)  │
├─────────────────────────────────────────────────────────┤
│                      Backend Adapters                   │
│   Yosys  │ Verilator │ Icarus │ nextpnr │ openFPGALoader │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Package & Monorepo Structure

* `apps/desktop`: Native Desktop Application Shell (Electron/IPC + React technical design UI).
* `apps/cli`: Command-Line Interface (`logicforge create`, `build`, `synth`, `simulate`, `program`, `report`).
* `packages/core`: Strongly-typed data models, project manifest (`logicforge.project`), Event Bus, DAG Build Pipeline, and Build Cache (`build-manifest.json`).
* `packages/toolchain`: Process execution runner, environment sanitization, structured log parsers, and tool auto-detection.
* `packages/backends`: Modular backend adapters implementing `SynthesisBackend`, `SimulationBackend`, `PlaceRouteBackend`, `BitstreamBackend`, `ProgrammingBackend`.
* `packages/waveform`: VCD (Value Change Dump) parser and Canvas-based high-performance waveform renderer with multi-radix inspection.
* `packages/schematic`: Interactive SVG/Canvas netlist schematic parser and visualizer for Yosys RTL JSON output.
* `packages/constraints`: SDC/XDC constraint parser, pin planner matrix model, and DRC verification rules.
* `packages/editor`: HDL language rules, module hierarchy analyzer, symbol definitions, and diagnostics engine.

---

## 3. Data Models

### Project Manifest (`logicforge.project`)
```json
{
  "name": "my_fpga_project",
  "version": "1.0.0",
  "topModule": "top",
  "language": "SystemVerilog",
  "sources": ["rtl/top.sv", "rtl/alu.sv"],
  "simulationSources": ["sim/tb_top.sv"],
  "constraints": ["constraints/pins.xdc"],
  "target": {
    "vendor": "Lattice",
    "family": "iCE40",
    "part": "iCE40HX1K-TQ144",
    "package": "TQ144"
  },
  "board": "iCEstick",
  "toolchain": {
    "synthesis": "yosys",
    "simulation": "icarus",
    "placeAndRoute": "nextpnr",
    "programmer": "openfpgaloader"
  }
}
```

### Directed Acyclic Build Graph (DAG)

```text
       Source Files (rtl/*.sv, constraints/*.xdc)
                           │
                           ▼
                      Parse & Check
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      Simulate (Icarus/Verilator)   Elaborate & Synthesize (Yosys)
             │                           │
             ▼                           ▼
       Waveform (.vcd)            RTL Netlist JSON / Schematic
                                         │
                                         ▼
                                   Place & Route (nextpnr)
                                         │
                                         ▼
                                   Timing & Resource Analysis
                                         │
                                         ▼
                                   Bitstream Generation (.bin)
                                         │
                                         ▼
                                   Program Hardware
```

---

## 4. Backend Plugin API

Every tool backend implements common interfaces:

```typescript
export interface SynthesisBackend {
  id: string;
  name: string;
  synthesize(params: SynthesisOptions): Promise<SynthesisResult>;
}

export interface SimulationBackend {
  id: string;
  name: string;
  simulate(params: SimulationOptions): Promise<SimulationResult>;
}

export interface ProgrammingBackend {
  id: string;
  name: string;
  program(params: ProgramOptions): Promise<ProgramResult>;
}
```

---

## 5. Process Isolation & Security Model

1. All external tools (`yosys`, `iverilog`, `vvp`, `nextpnr`, `openFPGALoader`) execute in isolated child processes with explicit timeout enforcement and environment variable sanitization.
2. Tool execution pathing is validated before execution to prevent arbitrary binary invocation.
3. Errors and warnings are streams parsed into structured diagnostic objects (`DiagnosticMessage`).

