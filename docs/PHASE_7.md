# LogicForge Phase 7 — Ecosystem Expansion & Advanced Hardware Debug

LogicForge Phase 7 transforms LogicForge into an extensible FPGA ecosystem platform with hardware debug probe infrastructure, Gowin open-toolchain backend capability support, device search database tooling, and automated hardware testing.

## Subsystems Implemented

### 1. Advanced Hardware Debug & Probe Service (`DebugService`)
* Hardware probe capability matrix (`HardwareProbeCapability`).
* Debug session lifecycle manager (`createSession()`).
* Capture buffer result exporter (`executeCapture()`).

### 2. Backend Capability Matrix (`BackendRegistry`)
* Exposes machine-readable capabilities for Lattice iCE40, Lattice ECP5, and Gowin GW1N open toolchain paths.

### 3. Device Database Search & Validation (`DeviceSearchService`)
* Device specification lookup engine for LUT/FF/BRAM counts and packaging.

### 4. Hardware Test Automation (`HardwareTestService`)
* Automated hardware target test runner model with `HARDWARE_UNAVAILABLE` status classification.

## CLI Subcommands Added

```bash
logicforge backends [--json]
logicforge environment [--json]
```
