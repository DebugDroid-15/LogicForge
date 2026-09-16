export interface VCDSignal {
  id: string;
  name: string;
  type: string;
  size: number;
  scope: string;
  changes: Array<{ time: number; value: string }>;
}

export interface VCDParsedData {
  timescale: string;
  date?: string;
  version?: string;
  maxTime: number;
  signals: Record<string, VCDSignal>;
}

export class VCDParser {
  public static parse(vcdContent: string): VCDParsedData {
    const lines = vcdContent.split(/\r?\n/);
    const signals: Record<string, VCDSignal> = {};
    const idToSignal: Record<string, VCDSignal> = {};

    let timescale = '1ns';
    let date: string | undefined;
    let version: string | undefined;
    let scopePath: string[] = [];
    let currentTime = 0;
    let maxTime = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('$timescale')) {
        const match = line.match(/\$timescale\s+([^\$]+)\s*\$end/);
        if (match) timescale = match[1].trim();
      } else if (line.startsWith('$scope')) {
        const parts = line.split(/\s+/);
        if (parts.length >= 3) scopePath.push(parts[2]);
      } else if (line.startsWith('$upscope')) {
        scopePath.pop();
      } else if (line.startsWith('$var')) {
        // $var wire 1 ! clk $end or $var wire 24 # counter [23:0] $end
        const parts = line.split(/\s+/);
        if (parts.length >= 5) {
          const type = parts[1];
          const size = parseInt(parts[2], 10);
          const id = parts[3];
          const name = parts[4];
          const fullScope = scopePath.join('.');
          const fullName = fullScope ? `${fullScope}.${name}` : name;

          const signal: VCDSignal = {
            id,
            name: fullName,
            type,
            size,
            scope: fullScope,
            changes: [],
          };
          signals[fullName] = signal;
          idToSignal[id] = signal;
        }
      } else if (line.startsWith('#')) {
        currentTime = parseInt(line.substring(1), 10);
        if (currentTime > maxTime) maxTime = currentTime;
      } else if (!line.startsWith('$')) {
        // Value change: "0!" or "b0011 #"
        if (line.startsWith('b') || line.startsWith('B')) {
          const parts = line.split(/\s+/);
          const val = parts[0].substring(1);
          const id = parts[1];
          const sig = idToSignal[id];
          if (sig) sig.changes.push({ time: currentTime, value: val });
        } else {
          const val = line[0];
          const id = line.substring(1);
          const sig = idToSignal[id];
          if (sig) sig.changes.push({ time: currentTime, value: val });
        }
      }
    }

    return { timescale, date, version, maxTime, signals };
  }
}

