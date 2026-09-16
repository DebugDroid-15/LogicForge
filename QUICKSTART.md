# LogicForge — Quickstart Guide

Get up and running with **LogicForge v1.0.0** in under two minutes.

---

## 1. One-Click Launch (Windows)

Simply double-click the root launcher in File Explorer:

```text
launch_logicforge.bat
```

The launcher will:
1. Validate your system environment (Windows, Node.js, npm).
2. Automatically prompt and install missing required runtimes if needed via `winget`.
3. Check and compile any missing workspace dependencies automatically.
4. Detect optional FPGA toolchains (`iverilog`, `yosys`, `nextpnr`, `openFPGALoader`).
5. Write a diagnostic log to `logs/startup.log`.
6. Launch the **LogicForge Desktop IDE**.

---

## 2. Opening the Desktop IDE

Once launched, your default web browser or desktop window will open to:

```text
http://localhost:3000
```

---

## 3. Creating Your First Project

1. On the **HOME** tab, click **New Project** or navigate to the **DESIGN** workspace.
2. Select your target FPGA device (e.g., `Lattice iCE40HX1K-TQ144`).
3. Choose a starter template (`Blink LED` or `Counter`).
4. LogicForge generates your RTL source (`rtl/top.v`) and project manifest (`logicforge.json`).

---

## 4. Simulating RTL

1. Switch to the **SIMULATION** tab.
2. Click **SIMULATE** on the top command bar.
3. Observe digital waveforms rendered in real time with interactive cursors and multi-radix viewers.

---

## 5. Building for FPGA

1. Click **SYNTHESIZE** or **BUILD** on the top command bar.
2. Monitor real-time resource utilization (LUTs, Flip-Flops, BRAMs, I/O) and timing slack in the **SYNTHESIS** and **REPORTS** tabs.

---

## 6. Programming Hardware

1. Connect your FPGA dev board (e.g. iCEstick / iCE40) via USB.
2. Navigate to the **HARDWARE** tab.
3. Click **Program Bitstream**.
4. Open the **Integrated UART Terminal** to interact with your running hardware design!

---

## Help & Resources

- [User Manual](docs/USER_MANUAL.md)
- [Toolchain Setup Guide](docs/TOOLCHAIN_SETUP.md)
- [Board Setup Guide](docs/BOARD_SETUP.md)
- [Troubleshooting & FAQ](docs/TROUBLESHOOTING.md)

