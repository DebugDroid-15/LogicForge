# LogicForge

> **Forge HDL into Hardware.**  
> Lightweight, Modern, Cross-Platform FPGA Development Environment.

---

## Overview

**LogicForge** is an independent, lightweight FPGA development environment designed to provide a unified workflow for HDL development, RTL analysis, simulation, synthesis, placement & routing, timing analysis, resource utilization, bitstream generation, FPGA programming, waveform analysis, and hardware debugging.

### What LogicForge Is Not
- It is NOT a bloated multi-gigabyte proprietary vendor IDE clone.
- It does NOT rely on fake simulation or mock tool outputs.
- It does NOT integrate proprietary vendor algorithms or locked databases into the core.

### Core Principles
1. **Modular**: Clean separation between UI, Build Engine, Toolchain Manager, and Backend Adapters.
2. **Vendor-Neutral**: Uniform orchestration for open-source toolchains (Yosys, Icarus, Verilator, nextpnr, openFPGALoader) and vendor CLI flows.
3. **Lightweight & Fast**: Immediate startup (<2s), low RAM consumption, responsive UI during heavy background builds.
4. **Scriptable & Reproducible**: Fully automated via headless CLI (`logicforge`) and deterministic build manifests (`build-manifest.json`).

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    LogicForge Desktop UI                │
│            (React 18 / TypeScript / Design System)      │
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

## Features

- **Headless Automation CLI**: Run full simulation, synthesis, and bitstream generation headless in CI pipelines (`logicforge build`).
- **Interactive RTL Schematic Visualizer**: Parses Yosys JSON netlists into zoomable block diagrams with clickable module hierarchy navigation.
- **Native Waveform Viewer**: Renders Value Change Dump (`.vcd`) files on a GPU-accelerated canvas with cursors, multi-radix support (Binary, Hex, Dec, ASCII), and signal groupings.
- **Pin Planner & Constraint Matrix**: XDC/SDC constraint parser synchronized with a visual package pin interface.
- **Resource Utilization & Timing Breakdown**: Real-time visual metrics for LUTs, Flip-Flops, BRAMs, DSPs, and IOs.
- **Hardware Manager & Integrated UART Terminal**: Board discovery, bitstream flashing, serial terminal debugging.
- **Side-by-Side Build Comparison**: Compare resource consumption, timing slack, and gate counts across build revisions.
- **HDL Linting & Analysis**: Detect latches (`LF-LINT-001`), width mismatches (`LF-LINT-002`), and undriven signals (`LF-LINT-004`).
- **Parameterized IP Catalog & Block Design**: Rapid core generator for FIFOs, UART, PWM, and topological wrapper emission.
- **Formal Verification Engine**: Formal property proof checking via SymbiYosys and SMT-BMC solvers.
- **Reproducible Packaging & Lockfile**: SHA256 deterministic build fingerprints and `logicforge.lock` lockfile tracking.

---

## Documentation

- [Release v1.0.0 Notes](docs/RELEASE_v1.0.0.md)
- [Capabilities Matrix](docs/CAPABILITIES.md)
- [Phase 8 Audit](docs/PHASE_8_AUDIT.md)
- [Phase 7 Overview](docs/PHASE_7.md)
- [Phase 6 Overview](docs/PHASE_6.md)
- [Phase 5 Overview](docs/PHASE_5.md)
- [Phase 4 Overview](docs/PHASE_4.md)
- [HDL Linting Guide](docs/LINTING.md)
- [IP Cores Guide](docs/IP.md)
- [Block Design Guide](docs/BLOCK_DESIGN.md)
- [Formal Verification Guide](docs/FORMAL.md)
- [Supported Devices Matrix](docs/SUPPORTED_DEVICES.md)
- [Toolchain Capabilities Matrix](docs/TOOLCHAIN_MATRIX.md)

---

## Quick Start (CLI)

```bash
# Clone and install dependencies
npm install

# Build workspace packages
npm run build

# Create a new FPGA project
node apps/cli/bin/logicforge.js create --name my_fpga --target ice40 --template blink

# Run simulation
node apps/cli/bin/logicforge.js simulate --project my_fpga/logicforge.project

# Run synthesis
node apps/cli/bin/logicforge.js synth --project my_fpga/logicforge.project
```

---

## License

LogicForge is licensed under the [Apache License 2.0](LICENSE).  
Third-party component licenses are detailed in [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES).

