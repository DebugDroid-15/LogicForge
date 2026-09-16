# Block Design & Top-Level Wrapper Generation

LogicForge supports block design topology validation and automated top-level Verilog wrapper generation via `BlockDesignService`.

## Features

* **Connection Sanity Check**: Ensures all source and target ports exist on instantiated module blocks.
* **Width Verification**: Flags bus width mismatches between connected module pins.
* **Wrapper Code Generator**: Automatically emits clean Verilog instantiations for all blocks and interconnections.

