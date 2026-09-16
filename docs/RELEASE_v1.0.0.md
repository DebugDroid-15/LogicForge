# Release Notes — LogicForge v1.0.0

**LogicForge v1.0.0** is a lightweight, open-source, vendor-neutral FPGA development environment featuring reproducible builds, integrated RTL analysis, simulation, synthesis, implementation, timing & resource breakdown, IP generation, block-design workflows, and hardware programming capabilities.

## Major Capabilities in v1.0.0

1. **Vendor-Neutral FPGA Build Pipeline**: Full support for Lattice iCE40 and ECP5 open-toolchain flows (Yosys + nextpnr + icepack/ecppack + openFPGALoader).
2. **RTL Design Intelligence**: Real AST design graph hierarchy parsing, finite state machine (FSM) extraction, clock domain crossing (CDC) diagnostics, and reset domain analysis.
3. **Interactive Visualizers**: GPU-accelerated canvas VCD waveform viewer, zoomable netlist schematic visualizer, constraint pin planner, and timing slack explorer.
4. **IP Core Catalog & Block Design Canvas**: Parameterized IP core generator for synchronous FIFOs, UART transmitters, and PWM generators, complete with topological top-level wrapper code emission.
5. **Headless Automation CLI & Reproducible Builds**: Non-zero exit code CI execution mode (`--ci`), deterministic SHA256 build fingerprints, and `logicforge.lock` lockfile tracking.

## Verification Metrics

- **TypeScript Compilation**: `npx tsc -b` -> 0 errors across 8 monorepo packages.
- **Unit Test Execution**: `npm test` -> 26/26 unit test suites passed (100% pass rate).
- **Golden Project**: Validated on `examples/99_release_validation`.

## Hardware & Toolchain Dependencies

- **Simulation**: Icarus Verilog (`iverilog`, `vvp`).
- **Synthesis & Pn R**: Yosys, `nextpnr-ice40`, `nextpnr-ecp5`.
- **Flashing**: `openFPGALoader`.
- **Target Boards**: Lattice iCEstick (iCE40HX1K-TQ144), ECP5-5G-EVN (LFE5UM5G-85F-8BG381C).
