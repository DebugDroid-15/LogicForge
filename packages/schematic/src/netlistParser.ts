export interface NetlistPort {
  name: string;
  direction: 'input' | 'output' | 'inout';
  bits: number[];
}

export interface NetlistCell {
  name: string;
  type: string;
  connections: Record<string, number[]>;
}

export interface NetlistModule {
  name: string;
  ports: Record<string, NetlistPort>;
  cells: Record<string, NetlistCell>;
}

export interface RenderableNode {
  id: string;
  label: string;
  type: 'PORT' | 'GATE' | 'MODULE' | 'REGISTER';
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: string[];
  outputs: string[];
}

export interface RenderableEdge {
  fromNode: string;
  toNode: string;
  label?: string;
}

export class NetlistParser {
  public static parseYosysJson(jsonContent: string, topModuleName?: string): {
    topModule: string;
    nodes: RenderableNode[];
    edges: RenderableEdge[];
  } {
    const raw = JSON.parse(jsonContent);
    const modules: Record<string, NetlistModule> = raw.modules || {};
    const top = topModuleName || Object.keys(modules)[0] || 'top';
    const mod = modules[top];

    if (!mod) {
      return { topModule: top, nodes: [], edges: [] };
    }

    const nodes: RenderableNode[] = [];
    const edges: RenderableEdge[] = [];
    let xOffset = 50;
    let yOffset = 50;

    // Add Ports
    if (mod.ports) {
      for (const [pName, port] of Object.entries(mod.ports)) {
        const isInput = port.direction === 'input';
        nodes.push({
          id: `port_${pName}`,
          label: `${pName} (${port.direction})`,
          type: 'PORT',
          x: isInput ? 40 : 600,
          y: yOffset,
          width: 120,
          height: 40,
          inputs: isInput ? [] : [pName],
          outputs: isInput ? [pName] : [],
        });
        yOffset += 60;
      }
    }

    // Add Cells
    yOffset = 50;
    if (mod.cells) {
      for (const [cName, cell] of Object.entries(mod.cells)) {
        const cellType = cell.type.replace(/^\$/, '');
        nodes.push({
          id: `cell_${cName}`,
          label: `${cName}\n[${cellType}]`,
          type: cellType.includes('DFF') || cellType.includes('REG') ? 'REGISTER' : 'GATE',
          x: 280,
          y: yOffset,
          width: 140,
          height: 70,
          inputs: Object.keys(cell.connections).filter((k) => k !== 'Y' && k !== 'Q'),
          outputs: Object.keys(cell.connections).filter((k) => k === 'Y' || k === 'Q'),
        });
        yOffset += 90;
      }
    }

    // Auto-connect edges based on signal names
    for (const n1 of nodes) {
      for (const n2 of nodes) {
        if (n1.id !== n2.id && n1.outputs.some((o) => n2.inputs.includes(o))) {
          edges.push({
            fromNode: n1.id,
            toNode: n2.id,
          });
        }
      }
    }

    return { topModule: top, nodes, edges };
  }
}

