# LogicForge — Desktop Architecture Specification

## Overview & Architecture Decision

LogicForge requires a native application window experience on Windows without exposing `http://localhost` URLs or browser tabs to the user.

### Architectural Decision

After auditing the monorepo, **LogicForge Desktop** is structured as a dedicated application window powered by Microsoft Edge App Mode (`msedge.exe --app=...`) and local HTTP server orchestration.

### Key Benefits
1. **Zero Browser URL/Tabs Interface**: Opens as an isolated, frameless-style native application window with custom icon, window title, and application shortcut capability.
2. **Subprocess & File System Isolation**: Full access to Node.js toolchain isolation, child process orchestration (Yosys, Icarus Verilog, nextpnr, openFPGALoader), and native hardware communication (`SerialBackend`, `HardwareService`).
3. **No Heavy Distribution Overhead**: Keeps binary footprint under 15MB without requiring multi-gigabyte Electron runtime downloads while delivering an identical standalone window UX.

---

## Process Architecture

```text
┌────────────────────────────────────────────────────────┐
│             LogicForge Desktop Application             │
│            (Native App Window: Edge App Shell)         │
├────────────────────────────────────────────────────────┤
│                 IPC / HTTP Bridge                     │
│         (Node.js Desktop Server / Port 3000)           │
├────────────────────────────────────────────────────────┤
│              Core FPGA Domain Engine Services          │
│   DAG Engine │ Linting │ FSM │ CDC │ Timing │ Hardware   │
└────────────────────────────────────────────────────────┘
```

---

## Desktop Application Components

1. **Launcher (`launch_logicforge.bat`)**:
   - Performs environment checks (Node.js, npm).
   - Prompts for automatic installation of missing runtimes via `winget`.
   - Compiles workspace packages if build artifacts are missing (`npx tsc -b`).
   - Detects optional FPGA toolchains.
   - Starts the Desktop Server (`apps/desktop/bin/dev.js`).
   - Launches the **Native Desktop Application Window** in App Mode:
     `msedge.exe --app=http://localhost:3000 --name="LogicForge FPGA IDE"`

2. **Standalone Server (`apps/desktop/bin/dev.js`)**:
   - Serves workspace package modules and UI assets locally.
