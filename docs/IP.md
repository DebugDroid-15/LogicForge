# IP Core Architecture & Parameterized Generation

LogicForge provides a parameterized IP catalog and code generation engine (`IPService`) enabling rapid instantiation of standard FPGA primitives without custom HDL reinvention.

## Catalog Cores

1. **Synchronous FIFO Buffer (`fifo_sync`)**
   * Parameters: `DATA_WIDTH` (default 8), `FIFO_DEPTH` (default 16)
2. **UART Transmitter Core (`uart_tx`)**
   * Parameters: `BAUD_DIV` (default 104)
3. **PWM Generator Core (`pwm_generator`)**
   * Parameters: `PWM_BITS` (default 8)

## CLI Usage

List available IP cores:
```bash
logicforge ip list
```

Generate IP instance in project:
```bash
logicforge ip generate --ip fifo_sync --name u_fifo
```

