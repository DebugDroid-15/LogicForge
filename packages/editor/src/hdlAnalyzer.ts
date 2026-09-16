export interface ModuleSymbol {
  name: string;
  file: string;
  line: number;
  ports: Array<{ name: string; direction: 'input' | 'output' | 'inout'; type: string }>;
  submodules: Array<{ moduleName: string; instanceName: string; line: number }>;
  fsmStates?: string[];
}

export class HDLAnalyzer {
  public static parseModule(filePath: string, content: string): ModuleSymbol[] {
    const lines = content.split(/\r?\n/);
    const modules: ModuleSymbol[] = [];

    let currentModule: ModuleSymbol | null = null;
    let fsmStates: Set<string> = new Set();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('//')) continue;

      // Module match: "module top (" or "module top;"
      const modMatch = line.match(/^module\s+([a-zA-Z_]\w*)/);
      if (modMatch) {
        currentModule = {
          name: modMatch[1],
          file: filePath,
          line: i + 1,
          ports: [],
          submodules: [],
        };
        fsmStates = new Set();
        continue;
      }

      if (currentModule) {
        // Port match: "input wire clk," or "output reg [7:0] count"
        const portMatch = line.match(/(input|output|inout)\s+(?:wire|reg)?\s*(?:\[[^\]]+\])?\s*([a-zA-Z_]\w*)/);
        if (portMatch) {
          currentModule.ports.push({
            name: portMatch[2],
            direction: portMatch[1] as any,
            type: line.includes('reg') ? 'reg' : 'wire',
          });
        }

        // Submodule instantiation: "alu u_alu ("
        const subMatch = line.match(/^([a-zA-Z_]\w*)\s+([a-zA-Z_]\w*)\s*\(/);
        if (subMatch && !['module', 'always', 'initial', 'assign', 'if', 'else', 'case'].includes(subMatch[1])) {
          currentModule.submodules.push({
            moduleName: subMatch[1],
            instanceName: subMatch[2],
            line: i + 1,
          });
        }

        // FSM State parameter detection: "localparam IDLE = 2'b00, ACTIVE = 2'b01, DONE = 2'b10;"
        const paramMatch = line.match(/(?:parameter|localparam)\s+([^;]+);/);
        if (paramMatch) {
          const parts = paramMatch[1].split(',');
          for (const p of parts) {
            const nameMatch = p.match(/([a-zA-Z_]\w*)\s*=/);
            if (nameMatch) fsmStates.add(nameMatch[1]);
          }
        }

        if (line.startsWith('endmodule')) {
          if (fsmStates.size > 0) {
            currentModule.fsmStates = Array.from(fsmStates);
          }
          modules.push(currentModule);
          currentModule = null;
        }
      }
    }

    return modules;
  }
}

