# Changelog

All notable changes to LogicForge will be documented in this file.

## [1.0.0] - Production Release — 2026-09-16

### Added
- **Production Root Launcher (`launch_logicforge.bat`)**: Self-bootstrapping launcher for Windows. Automatically detects runtime dependencies (Node.js, npm), handles `winget` installation prompts, self-heals missing workspace packages, detects optional FPGA toolchains (`iverilog`, `yosys`, `nextpnr`, `openFPGALoader`), and writes diagnostic startup logs to `logs/startup.log`.
- **Integrated Desktop Server Runner (`apps/desktop/bin/dev.js`)**: Standalone local server runner hosting the LogicForge Desktop application at `http://localhost:3000`.
- **Comprehensive End-User Documentation Matrix**: Added `QUICKSTART.md`, `docs/USER_MANUAL.md`, `docs/TOOLCHAIN_SETUP.md`, `docs/BOARD_SETUP.md`, and `docs/TROUBLESHOOTING.md`.

## [0.7.0-alpha] - Phase 7 — 2026-09-16


### Added
- **Advanced Hardware Debug & Probe Service (`DebugService`)**: Probe capability discovery matrix, debug session lifecycle manager, and logic analyzer sample capture model.
- **FPGA Backend Capability Matrix (`BackendRegistry`)**: Machine-readable capabilities for Lattice iCE40, ECP5, and Gowin GW1N backends.
- **Device Search & Validation Engine (`DeviceSearchService`)**: Part specifications lookup tool for LUT/FF/BRAM counts and packaging.
- **Automated Hardware Test Runner (`HardwareTestService`)**: Execution model for hardware targets with `HARDWARE_UNAVAILABLE` status classification.
- **Headless CLI Commands**: Added `logicforge backends` and `logicforge environment`.
- **Phase 7 Documentation & Example**: Created `examples/26_hardware_test`, `docs/PHASE_7.md`, and `docs/PHASE_7_PLAN.md`.

## [0.6.0-alpha] - Phase 6 — 2026-09-16

### Added
- **Integrated Workspace Layout (`WorkspaceService`)**: Dockable panel, open file, and layout state persistence manager.
- **Diagnostic Quick Fix Framework (`QuickFixService`)**: Automated code fix suggestions for latches and vector width mismatches.
- **Formal Plugin SDK (`PluginService`)**: Extensible backend, board, simulator, and debugger plugin manifest registry.
- **Hardware Debug Probe Architecture (`DebugArchitectureService`)**: Probe capability detection interface.
- **Headless CLI Commands**: Added `logicforge ci-report`, `logicforge plugins`, and `logicforge debug-info`.
- **Phase 6 Documentation**: Created `docs/PHASE_6.md`.

## [0.5.0-alpha] - Phase 5 — 2026-09-16

### Added
- **AST Design Graph Engine (`DesignGraphService`)**: Structural module hierarchy, port, signal, and instance relation parser.
- **FSM State Machine Extractor (`FSMService`)**: Extraction of state registers, encodings, transitions, and conditions.
- **Clock & Reset Domain Analysis (`CDCService`, `ResetService`)**: Unsynchronized cross-domain sampling diagnostics (`LF-CDC-001`) and reset release timing checks (`RESET-001`).
- **Resource Utilization Parsing & Trending (`ResourceAnalysisService`, `ResourceTrendingService`)**: Primitive cell count parsing and build-over-build delta comparison (`compare-build`).
- **Testbench Service (`TestbenchService`)**: Simulation testbench spec management.
- **Headless CLI Subcommands**: Added `logicforge analyze`, `logicforge fsm`, `logicforge cdc`, `logicforge reset`, and `logicforge resources`.
- **Phase 5 Documentation & Example**: Created `examples/13_rtl_analysis` and `docs/PHASE_5.md`.

## [0.4.0] - Phase 4 — 2026-09-16

### Added
- **HDL Linting Engine (`HDLLintService`)**: Static rules for combinational latch detection (`LF-LINT-001`), bus width mismatches (`LF-LINT-002`), and undriven wire declarations (`LF-LINT-004`).
- **Parameterized IP Generator (`IPService`)**: Vendor-neutral IP catalog for Synchronous FIFOs, UART Transmitters, and PWM Generators.
- **Block Design Topology Validator & Wrapper Engine (`BlockDesignService`)**: Automated bus width verification and top-level Verilog wrapper emitter.
- **Formal Verification Engine (`FormalService`)**: Integration for SymbiYosys assertion checking and bounded model checking.
- **Reproducible Build Fingerprinting & Lockfile (`ProjectPackager`)**: SHA256 build fingerprinting and `logicforge.lock` lockfile tracking.
- **CLI Commands**: Added `logicforge lint`, `logicforge ip <list|generate>`, `logicforge formal`, and `logicforge package`.
- **Phase 4 Examples & Documentation**: Created `examples/10_ip_example`, `examples/11_block_design`, `examples/12_formal`, `docs/PHASE_4.md`, `docs/LINTING.md`, `docs/IP.md`, `docs/BLOCK_DESIGN.md`, and `docs/FORMAL.md`.

## [0.1.0] - 2026-09-15

### Added
- Initial release of **LogicForge** core architecture and engine.
- Headless CLI (`logicforge create`, `build`, `synth`, `simulate`, `program`, `report`).
- Asynchronous Toolchain Subprocess Runner with structured output parsing (errors, warnings, timing, utilization).
- Modular Backend Adapter System for **Icarus Verilog**, **Verilator**, **Yosys**, **nextpnr**, and **openFPGALoader**.
- VCD Waveform Parser and Canvas Digital Waveform Viewer with multi-radix inspection.
- Netlist Schematic Engine converting Yosys JSON netlists into zoomable/pannable block diagrams with cross-probing.
- Pin Planner & XDC/SDC Constraint Parser with DRC rules.
- Hardware Manager & Integrated Serial Terminal (UART).
- Report Center with resource utilization charts and side-by-side build comparison.
- Golden template projects: Blink LED, Counter, FSM, UART, FIFO, PWM.

