# LogicForge — Supported Devices & FPGA Targets Specification

LogicForge uses a modular backend architecture to communicate with open-source toolchains and vendor utilities.

---

## FPGA Family Support Matrix

| Family | Vendor | Target Toolchain | Synthesis | P&R | Bitstream | Programming | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **iCE40** | Lattice | Yosys + nextpnr-ice40 + icepack + openFPGALoader | ✓ | ✓ | ✓ | ✓ | **STABLE (Reference)** |
| **ECP5** | Lattice | Yosys + nextpnr-ecp5 + ecppack + openFPGALoader | ✓ | ✓ | ✓ | ✓ | **STABLE** |
| **Gowin** | Gowin | Yosys + nextpnr-gowin + gowin_pack + openFPGALoader | ✓ | ✓ | ✓ | ✓ | **EXPERIMENTAL** |
| **Nexus / CrossLink-NX** | Lattice | Yosys + prjtrellis/prjoxide + nextpnr | ✓ | ✓ | ✓ | ✓ | **PLANNED** |
| **XC7 (Artix/Kintex 7)** | AMD / Xilinx | Yosys + Symbiflow / Vivado CLI | ✓ | ✓ | ✓ | ✓ | **PLANNED** |

---

## Reference Target Devices

### 1. Lattice iCE40
- **Parts**: `iCE40HX1K-TQ144`, `iCE40HX8K-CT256`, `iCE40UP5K-SG48`
- **Primitives**: `SB_LUT4`, `SB_DFF`, `SB_RAM40_4K`, `SB_IO`, `SB_GB`
- **Constraint Format**: `.pcf` (Physical Constraints File) / `.xdc` (LogicForge Unified Format)
- **Supported Boards**: iCEstick, iCE40-HX8K-Breakout, IceBreaker

### 2. Lattice ECP5
- **Parts**: `LFE5U-12F`, `LFE5U-25F`, `LFE5U-45F`, `LFE5U-85F`
- **Primitives**: `TRELLIS_SLICE` (LUT4 + DFF pair), `DP16KD` (Block RAM), `MULT18X18D` (DSP)
- **Constraint Format**: `.lpf` (Lattice Preference File) / `.xdc`
- **Supported Boards**: ECP5-5G-EVN, OrangeCrab, Colorlight i5/i9

