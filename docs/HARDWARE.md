# LogicForge — Hardware Management & Serial Debug Specification

LogicForge interacts with physical FPGA hardware via open-source JTAG/SPI programmers and onboard serial converters (FTDI FT2232H, CH340, CP2102).

---

## Hardware Lifecycle State Machine

```text
  ┌──────────────┐
  │ Disconnected │
  └──────┬───────┘
         │ USB Inserted / Enumerate
         ▼
  ┌──────────────┐
  │   Detected   │
  └──────┬───────┘
         │ Connect Board
         ▼
  ┌──────────────┐
  │  Connected   │
  └──────┬───────┘
         │ Initiate Flashing
         ▼
  ┌──────────────┐
  │ Programming  │
  └──────┬───────┘
         │ Verify
         ▼
  ┌──────────────┐
  │  Programmed  │
  └──────────────┘
```

---

## Serial UART Terminal Parameters

- **Default Parameters**: 115200 Baud, 8 Data Bits, No Parity, 1 Stop Bit (8N1).
- **Supported Baud Rates**: 9600, 19200, 38400, 57600, 115200, 230400.
- **Console Modes**: ASCII Text / Hexadecimal byte inspector.

