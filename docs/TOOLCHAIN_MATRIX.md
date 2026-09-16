# LogicForge — Toolchain Capabilities & Matrix

LogicForge delegates simulation, synthesis, place-and-route, timing analysis, and hardware programming to specialized external binaries.

---

## Toolchain Feature Matrix

| Tool Binary | Provider / License | Functionality | Supported Input Formats | Primary Outputs |
| :--- | :--- | :--- | :--- | :--- |
| **Icarus Verilog** (`iverilog`, `vvp`) | GPL v2+ | Verilog HDL Simulation | `.v`, `.sv` (subset) | `.vvp`, `.vcd` (Waveforms) |
| **Verilator** (`verilator`) | LGPL v3 / Artistic | High-Speed C++ Cycle Simulation | `.v`, `.sv` | C++ testbench binary, `.vcd`, `.fst` |
| **Yosys** (`yosys`) | ISC License | RTL Synthesis & Technology Mapping | Verilog / SystemVerilog | JSON Netlist, Technology Verilog |
| **nextpnr** (`nextpnr-ice40`, `nextpnr-ecp5`) | ISC License | Place and Route & Timing Analysis | JSON Netlist, PCF/LPF/XDC | `.asc`, `.config`, `timing.json` |
| **icepack / ecppack** | ISC / MIT | Bitstream Packing Utility | `.asc` / `.config` | `.bin` (Bitstream Binary) |
| **openFPGALoader** | Apache 2.0 | Universal FPGA Flashing | `.bin`, `.bit`, `.svf` | Hardware Flashing Logs |

---

## CLI Detection & Capabilities Protocol

LogicForge queries executable capabilities via command line flags:
- `iverilog -V` -> Extracts version and compiler options.
- `yosys -V` -> Extracts release version and plugin support.
- `nextpnr-ice40 -V` -> Verifies architecture support.
- `openFPGALoader -V` -> Verifies JTAG / SPI driver capabilities.

