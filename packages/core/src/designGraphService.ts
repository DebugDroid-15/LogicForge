export interface DesignNode {
  id: string;
  name: string;
  type: 'MODULE' | 'INSTANCE' | 'PORT' | 'SIGNAL' | 'CLOCK' | 'RESET' | 'MEMORY';
  moduleName?: string;
  file?: string;
  line?: number;
  children?: DesignNode[];
  properties?: Record<string, any>;
}

export interface DesignGraph {
  topModule: string;
  nodes: Record<string, DesignNode>;
  relationships: Array<{ from: string; to: string; type: 'instantiates' | 'connects' | 'drives' | 'reads' | 'clocked_by' | 'reset_by' }>;
}

export class DesignGraphService {
  public static buildGraph(sources: Array<{ path: string; content: string }>): DesignGraph {
    const nodes: Record<string, DesignNode> = {};
    const relationships: Array<{ from: string; to: string; type: 'instantiates' | 'connects' | 'drives' | 'reads' | 'clocked_by' | 'reset_by' }> = [];
    let topModule = 'top';

    for (const src of sources) {
      const lines = src.content.split(/\r?\n/);
      let currentModule = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const modMatch = line.match(/^\s*module\s+([a-zA-Z_]\w*)/);
        if (modMatch) {
          currentModule = modMatch[1];
          topModule = currentModule;
          nodes[currentModule] = {
            id: currentModule,
            name: currentModule,
            type: 'MODULE',
            file: src.path,
            line: i + 1,
            children: []
          };
        }

        const instMatch = line.match(/([a-zA-Z_]\w*)\s+(?:#\([^)]*\)\s+)?([a-zA-Z_]\w*)\s*\(/);
        if (instMatch && currentModule && !['module', 'always', 'initial', 'if', 'assign'].includes(instMatch[1])) {
          const modType = instMatch[1];
          const instName = instMatch[2];
          const instId = `${currentModule}.${instName}`;
          nodes[instId] = {
            id: instId,
            name: instName,
            type: 'INSTANCE',
            moduleName: modType,
            file: src.path,
            line: i + 1
          };
          if (nodes[currentModule] && nodes[currentModule].children) {
            nodes[currentModule].children!.push(nodes[instId]);
          }
          relationships.push({ from: currentModule, to: instId, type: 'instantiates' });
        }
      }
    }

    return { topModule, nodes, relationships };
  }

  public static getHierarchy(graph: DesignGraph): any {
    const top = graph.nodes[graph.topModule];
    if (!top) return { name: graph.topModule, children: [] };
    return top;
  }
}

