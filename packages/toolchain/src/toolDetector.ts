import { ProcessRunner } from './processRunner.js';

export interface ToolCapability {
  tool: string;
  installed: boolean;
  version?: string;
  path?: string;
  status: 'AVAILABLE' | 'MISSING' | 'ERROR';
  capabilities: string[];
}

export class ToolDetector {
  public static async detectTools(): Promise<Record<string, ToolCapability>> {
    const results: Record<string, ToolCapability> = {};

    results['icarus'] = await this.checkTool('iverilog', ['-V'], ['Verilog Simulation', 'VCD Output']);
    results['yosys'] = await this.checkTool('yosys', ['-V'], ['RTL Synthesis', 'JSON Netlist Export', 'Lattice iCE40/ECP5 Tech Mapping']);
    results['verilator'] = await this.checkTool('verilator', ['--version'], ['Cycle-Accurate C++ Simulation', 'SystemVerilog Support']);
    results['nextpnr-ice40'] = await this.checkTool('nextpnr-ice40', ['-V'], ['iCE40 Place & Route', 'Timing Analysis']);
    results['nextpnr-ecp5'] = await this.checkTool('nextpnr-ecp5', ['-V'], ['ECP5 Place & Route', 'Timing Analysis']);
    results['icepack'] = await this.checkTool('icepack', ['-V'], ['iCE40 Bitstream Generator']);
    results['ecppack'] = await this.checkTool('ecppack', ['-V'], ['ECP5 Bitstream Generator']);
    results['openfpgaloader'] = await this.checkTool('openFPGALoader', ['-V'], ['JTAG/SPI FPGA Flashing', 'Board Auto-Detection']);

    return results;
  }

  private static async checkTool(command: string, args: string[], caps: string[] = []): Promise<ToolCapability> {
    try {
      const res = await ProcessRunner.run({ command, args, timeoutMs: 3000 });
      if (res.exitCode === 0 || res.stdout.length > 0) {
        const firstLine = (res.stdout || res.stderr).split(/\r?\n/)[0].trim();
        return {
          tool: command,
          installed: true,
          version: firstLine,
          status: 'AVAILABLE',
          capabilities: caps,
        };
      }
    } catch {}

    return {
      tool: command,
      installed: false,
      status: 'MISSING',
      capabilities: caps,
    };
  }
}
