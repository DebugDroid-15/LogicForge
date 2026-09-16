# LogicForge Developer Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Recommended Open FPGA Toolchains:
  - **Icarus Verilog** (`iverilog`, `vvp`)
  - **Yosys** (`yosys`)
  - **Verilator** (`verilator`)
  - **nextpnr** (`nextpnr-ice40`, `nextpnr-ecp5`, `nextpnr-gowin`)
  - **openFPGALoader** (`openFPGALoader`)

## Quick Setup

```bash
# Install root and workspace dependencies
npm install

# Build all packages
npm run build

# Run core & backend unit tests
npm test

# Launch LogicForge Desktop App in dev mode
npm run dev

# Run LogicForge CLI
node apps/cli/bin/logicforge.js --help
```

## Running Example Workflows

```bash
# Run CLI simulation on example project
node apps/cli/bin/logicforge.js simulate --project examples/01_blink_led/logicforge.project

# Run CLI synthesis on example project
node apps/cli/bin/logicforge.js synth --project examples/01_blink_led/logicforge.project
```

