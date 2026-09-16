# LogicForge — Board Setup Guide

LogicForge supports open-source vendor-neutral hardware programming and UART serial debugging.

---

## Supported Boards

- **Lattice iCEstick** (iCE40HX1K-TQ144)
- **iCE40-HX8K Breakout Board**
- **Lattice ECP5 EVN**
- **Sipeed Tang Nano 9K** (Gowin GW1NR-9)
- **Generic FT2232H / FT232H JTAG Adapters**

---

## Driver Setup (Windows)

To allow `openFPGALoader` to access FTDI USB devices on Windows:

1. Download **Zadig**: `https://zadig.akeo.ie/`
2. Connect your FPGA board via USB.
3. Open Zadig, select **Options -> List All Devices**.
4. Select **Interface 0** of your FTDI board (e.g. `FT2232H (Interface 0)`).
5. Change driver to **WinUSB** or **libusbK**.
6. Click **Replace Driver**.

---

## Hardware Programming Workflow

1. Connect your board via USB.
2. Launch LogicForge (`launch_logicforge.bat`).
3. Build your project bitstream (**SYNTHESIZE** -> **BUILD**).
4. Navigate to the **HARDWARE** workspace tab.
5. Click **Program Bitstream**.
