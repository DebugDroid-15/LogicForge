# LogicForge — Toolchain Setup Guide

This guide explains how to install optional FPGA toolchains for LogicForge on Windows, Linux, and macOS.

---

## Toolchain Overview

LogicForge runs cleanly out-of-the-box for project navigation and code editing. Optional open-source tools unlock synthesis, simulation, PnR, and hardware flashing.

| Tool | Purpose | Required For |
|---|---|---|
| **Icarus Verilog** (`iverilog`) | Verilog Simulation | RTL Simulation |
| **Yosys** (`yosys`) | RTL Synthesis | Logic Synthesis |
| **nextpnr-ice40** | iCE40 Place & Route | iCE40 FPGA PnR |
| **nextpnr-ecp5** | ECP5 Place & Route | ECP5 FPGA PnR |
| **openFPGALoader** | JTAG/SPI Programmer | FPGA Programming |

---

## Windows Installation

### Option A: Using MSYS2 / OSS CAD Suite (Recommended)

1. Download the **OSS CAD Suite** release bundle:
   `https://github.com/YosysHQ/oss-cad-suite-build/releases`
2. Extract the archive to a folder (e.g. `C:\oss-cad-suite`).
3. Add `C:\oss-cad-suite\bin` to your System `PATH` environment variable.
4. Launch `launch_logicforge.bat` to verify automatic detection!

### Option B: Chocolatey / Winget

```powershell
# Install Icarus Verilog
winget install iverilog
```

---

## Verifying Tool Detection

Run the built-in environment doctor via CLI:

```bash
node apps/cli/bin/logicforge.js doctor
```

Or view the **Toolchain Status** card on the LogicForge Desktop **HOME** tab.
