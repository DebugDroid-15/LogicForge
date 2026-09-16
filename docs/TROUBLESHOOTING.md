# LogicForge — Troubleshooting & FAQ

Frequently asked questions and troubleshooting steps for LogicForge.

---

## Launcher & Environment FAQs

### Q: `launch_logicforge.bat` says Node.js is missing.
**A**: Ensure Node.js (v18+) is installed. The launcher offers automatic installation via `winget`. If automatic installation fails, download Node.js directly from `https://nodejs.org/`.

### Q: The launcher reports missing toolchains (Yosys, nextpnr). Can I still use LogicForge?
**A**: **Yes!** LogicForge launches cleanly without external tools. You can write RTL, navigate code hierarchy, view schematics, design block diagrams, manage pins, and configure IP cores. Synthesis and bitstream generation require the optional tools outlined in [Toolchain Setup](TOOLCHAIN_SETUP.md).

### Q: Hardware Manager displays "HARDWARE_UNAVAILABLE".
**A**: Check that your FPGA dev board is connected via USB and proper FTDI/WinUSB drivers are installed (see [Board Setup](BOARD_SETUP.md)). LogicForge never fabricates fake hardware connection statuses.

---

## Build & Diagnostic FAQs

### Q: What is `LF-LINT-001`?
**A**: `LF-LINT-001` indicates potential latch inference inside a combinational `always` block (e.g. missing `default` or `else` branch).

### Q: Where are build logs stored?
**A**: Launcher diagnostics are logged in `logs/startup.log`. Project build logs are output in real-time in the **BUILD CONSOLE** at the bottom of the LogicForge Desktop application.
