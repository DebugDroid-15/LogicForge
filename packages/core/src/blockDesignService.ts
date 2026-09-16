import * as fs from 'node:fs';
import * as path from 'node:path';

export interface BlockPort {
  name: string;
  direction: 'input' | 'output' | 'inout';
  width: number;
}

export interface BlockNode {
  id: string;
  name: string;
  moduleName: string;
  ports: BlockPort[];
}

export interface BlockConnection {
  fromBlock: string;
  fromPort: string;
  toBlock: string;
  toPort: string;
}

export interface BlockDesign {
  name: string;
  blocks: BlockNode[];
  connections: BlockConnection[];
}

export class BlockDesignService {
  public static validateDesign(design: BlockDesign): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const conn of design.connections) {
      const srcBlock = design.blocks.find((b) => b.id === conn.fromBlock);
      const dstBlock = design.blocks.find((b) => b.id === conn.toBlock);

      if (!srcBlock) errors.push(`Connection source block '${conn.fromBlock}' not found.`);
      if (!dstBlock) errors.push(`Connection target block '${conn.toBlock}' not found.`);

      if (srcBlock && dstBlock) {
        const srcPort = srcBlock.ports.find((p) => p.name === conn.fromPort);
        const dstPort = dstBlock.ports.find((p) => p.name === conn.toPort);

        if (!srcPort) errors.push(`Source port '${conn.fromPort}' missing on block '${srcBlock.name}'.`);
        if (!dstPort) errors.push(`Target port '${conn.toPort}' missing on block '${dstBlock.name}'.`);

        if (srcPort && dstPort && srcPort.width !== dstPort.width) {
          errors.push(`Width mismatch between '${srcBlock.name}.${srcPort.name}' (${srcPort.width} bits) and '${dstBlock.name}.${dstPort.name}' (${dstPort.width} bits).`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  public static generateWrapper(design: BlockDesign): string {
    return this.generateTopWrapper(design);
  }

  public static generateTopWrapper(design: BlockDesign): string {
    const lines = [
      `// LogicForge Generated Block Design Wrapper: ${design.name}`,
      `module ${design.name} (`,
      `    input wire clk,`,
      `    output wire led`,
      `);`,
      '',
    ];

    for (const block of design.blocks) {
      lines.push(`    ${block.moduleName} ${block.name} (`);
      const portLines = block.ports.map((p) => `        .${p.name}(${p.name === 'clk' ? 'clk' : p.name === 'led' ? 'led' : ''})`);
      lines.push(portLines.join(',\n'));
      lines.push(`    );`);
      lines.push('');
    }

    lines.push('endmodule');
    return lines.join('\n');
  }
}
