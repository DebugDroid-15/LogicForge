import * as fs from 'node:fs';
import * as path from 'node:path';
import { BoardDefinition } from './types.js';

export class BoardRegistry {
  private static instance: BoardRegistry;
  private boards: Map<string, BoardDefinition> = new Map();

  private constructor() {
    this.registerBuiltinBoards();
  }

  public static getInstance(): BoardRegistry {
    if (!BoardRegistry.instance) {
      BoardRegistry.instance = new BoardRegistry();
    }
    return BoardRegistry.instance;
  }

  public registerBoard(board: BoardDefinition): void {
    this.boards.set(board.id.toLowerCase(), board);
  }

  public getBoard(id: string): BoardDefinition | undefined {
    return this.boards.get(id.toLowerCase());
  }

  public listBoards(): BoardDefinition[] {
    return Array.from(this.boards.values());
  }

  public loadBoardDirectory(boardDir: string): void {
    if (!fs.existsSync(boardDir)) return;
    const entries = fs.readdirSync(boardDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const jsonPath = path.join(boardDir, entry.name, 'board.json');
        if (fs.existsSync(jsonPath)) {
          try {
            const raw = fs.readFileSync(jsonPath, 'utf-8');
            const def = JSON.parse(raw) as BoardDefinition;
            this.registerBoard(def);
          } catch (err) {
            console.error(`Failed to load board definition from ${jsonPath}:`, err);
          }
        }
      }
    }
  }

  private registerBuiltinBoards(): void {
    // iCEstick
    this.registerBoard({
      id: 'icestick',
      name: 'Lattice iCEstick Evaluation Kit',
      manufacturer: 'Lattice Semiconductor',
      fpga: {
        vendor: 'Lattice',
        family: 'iCE40',
        part: 'iCE40HX1K-TQ144',
        package: 'TQ144',
        lutCount: 1280,
        ffCount: 1280,
        bramCount: 16,
        dspCount: 0,
      },
      clockMHz: 12,
      clockPin: '21',
      pins: {
        clk: { pin: '21', ioStandard: 'LVCMOS33', description: '12MHz onboard oscillator' },
        led_green: { pin: '95', ioStandard: 'LVCMOS33', description: 'Center Green LED' },
        led_red: { pin: '96', ioStandard: 'LVCMOS33', description: 'Red LED D1' },
        uart_tx: { pin: '9', ioStandard: 'LVCMOS33', description: 'FTDI FT2232H UART TX' },
        uart_rx: { pin: '8', ioStandard: 'LVCMOS33', description: 'FTDI FT2232H UART RX' },
      },
      programmer: 'openfpgaloader',
    });

    // ECP5-5G-EVN
    this.registerBoard({
      id: 'ecp5-evn',
      name: 'Lattice ECP5-5G Evaluation Board',
      manufacturer: 'Lattice Semiconductor',
      fpga: {
        vendor: 'Lattice',
        family: 'ECP5',
        part: 'LFE5UM5G-85F-8BG381C',
        package: 'CABGA381',
        lutCount: 84000,
        ffCount: 84000,
        bramCount: 208,
        dspCount: 156,
      },
      clockMHz: 12,
      clockPin: 'A10',
      pins: {
        clk: { pin: 'A10', ioStandard: 'LVCMOS33' },
        led0: { pin: 'A13', ioStandard: 'LVCMOS33' },
      },
      programmer: 'openfpgaloader',
    });
  }
}

