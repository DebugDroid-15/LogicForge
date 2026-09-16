export interface PinConstraint {
  port: string;
  pin: string;
  ioStandard?: string;
  bank?: number;
  drive?: number;
  pullup?: boolean;
}

export interface ClockConstraint {
  name: string;
  periodNs: number;
  port: string;
}

export class XDCParser {
  public static parse(content: string): {
    pins: Record<string, PinConstraint>;
    clocks: ClockConstraint[];
  } {
    const lines = content.split(/\r?\n/);
    const pins: Record<string, PinConstraint> = {};
    const clocks: ClockConstraint[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      // XDC: set_property PACKAGE_PIN 21 [get_ports clk]
      const pinMatch = line.match(/set_property\s+PACKAGE_PIN\s+(\S+)\s+\[get_ports\s+(\S+)\]/i);
      if (pinMatch) {
        const [, pin, port] = pinMatch;
        pins[port] = { ...pins[port], port, pin };
        continue;
      }

      // XDC: set_property IOSTANDARD LVCMOS33 [get_ports clk]
      const ioMatch = line.match(/set_property\s+IOSTANDARD\s+(\S+)\s+\[get_ports\s+(\S+)\]/i);
      if (ioMatch) {
        const [, ioStandard, port] = ioMatch;
        pins[port] = { ...pins[port], port, pin: pins[port]?.pin || '', ioStandard };
        continue;
      }

      // PCF: set_io clk 21
      const pcfMatch = line.match(/^set_io\s+(\S+)\s+(\S+)/i);
      if (pcfMatch) {
        const [, port, pin] = pcfMatch;
        pins[port] = { port, pin, ioStandard: 'LVCMOS33' };
        continue;
      }

      // Clock: create_clock -period 10.000 -name clk [get_ports clk]
      const clkMatch = line.match(/create_clock\s+-period\s+([\d.]+)\s+-name\s+(\S+)\s+\[get_ports\s+(\S+)\]/i);
      if (clkMatch) {
        const [, periodStr, name, port] = clkMatch;
        clocks.push({
          name,
          periodNs: parseFloat(periodStr),
          port,
        });
      }
    }

    return { pins, clocks };
  }

  public static generateXDC(pins: Record<string, PinConstraint>, clocks: ClockConstraint[]): string {
    const lines: string[] = ['# LogicForge Generated XDC Constraints', ''];

    for (const clk of clocks) {
      lines.push(`create_clock -period ${clk.periodNs.toFixed(3)} -name ${clk.name} [get_ports ${clk.port}]`);
    }

    lines.push('');
    for (const [port, pin] of Object.entries(pins)) {
      if (pin.pin) {
        lines.push(`set_property PACKAGE_PIN ${pin.pin} [get_ports ${port}]`);
      }
      if (pin.ioStandard) {
        lines.push(`set_property IOSTANDARD ${pin.ioStandard} [get_ports ${port}]`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}

