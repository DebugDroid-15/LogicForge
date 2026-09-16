# Capability Matrix — LogicForge

| Subsystem | Feature | Status | Provenance / Notes |
|---|---|---|---|
| HDL Development | Verilog / SystemVerilog Parsing | `VERIFIED` | `DesignGraphService`, `HDLLintService` |
| Simulation | Icarus Verilog Testbench Runner | `VERIFIED` | `IcarusBackend`, VCD waveform viewer |
| Synthesis | Yosys Open RTL Synthesis | `VERIFIED` | JSON netlist & AST schematic export |
| Place & Route | nextpnr (iCE40 & ECP5) | `VERIFIED` | `NextpnrBackend`, Placement & Routing artifacts |
| Timing Analysis | Setup / Hold Slack Evaluation | `VERIFIED` | `TimingService` ($S = T_{req} - T_{act}$) |
| Resource Utilization | Primitive Cell Counting | `VERIFIED` | LUT4, DFF, BRAM parsing |
| Hardware Flashing | openFPGALoader Bitstream Program | `TOOL_DEPENDENT` | Requires `openFPGALoader` binary and target hardware |
| Hardware Debug | Probe & Logic Analyzer Capture | `HARDWARE_DEPENDENT` | `DebugService`, explicit `HARDWARE_UNAVAILABLE` tag |
| Formal Verification | SymbiYosys Assertion Checking | `TOOL_DEPENDENT` | Requires SymbiYosys / SMT-BMC solvers |
| Gowin Backend | GW1N Architecture Entry | `EXPERIMENTAL` | Capability matrix registered, open toolchain flow pending |
