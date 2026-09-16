import React, { useState, useEffect } from 'react';
import { NetlistParser, RenderableNode, RenderableEdge } from '@logicforge/schematic';

interface SchematicViewerProps {
  netlistJson?: string;
}

export const SchematicViewer: React.FC<SchematicViewerProps> = ({ netlistJson }) => {
  const [nodes, setNodes] = useState<RenderableNode[]>([]);
  const [edges, setEdges] = useState<RenderableEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [topModule, setTopModule] = useState<string>('top');

  useEffect(() => {
    if (netlistJson) {
      try {
        const parsed = NetlistParser.parseYosysJson(netlistJson);
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setTopModule(parsed.topModule);
      } catch (err) {
        console.error('Failed to parse netlist JSON:', err);
      }
    } else {
      // Default sample schematic for preview
      setNodes([
        { id: 'port_clk', label: 'clk (input)', type: 'PORT', x: 40, y: 40, width: 120, height: 40, inputs: [], outputs: ['clk'] },
        { id: 'port_rst', label: 'rst (input)', type: 'PORT', x: 40, y: 110, width: 120, height: 40, inputs: [], outputs: ['rst'] },
        { id: 'cell_adder', label: 'adder_0\n[$add]', type: 'GATE', x: 240, y: 40, width: 130, height: 60, inputs: ['clk'], outputs: ['sum'] },
        { id: 'cell_dff', label: 'reg_counter\n[$dff]', type: 'REGISTER', x: 430, y: 40, width: 140, height: 70, inputs: ['sum'], outputs: ['count'] },
        { id: 'port_count', label: 'count (output)', type: 'PORT', x: 630, y: 55, width: 120, height: 40, inputs: ['count'], outputs: [] },
      ]);
      setEdges([
        { fromNode: 'port_clk', toNode: 'cell_adder' },
        { fromNode: 'cell_adder', toNode: 'cell_dff' },
        { fromNode: 'cell_dff', toNode: 'port_count' },
      ]);
    }
  }, [netlistJson]);

  return (
    <div className="lf-schematic-panel">
      <div className="lf-schematic-toolbar">
        <span className="lf-panel-title">RTL SCHEMATIC VISUALIZER — [{topModule}]</span>
        <div className="lf-schematic-legend">
          <span className="legend-item port">Port</span>
          <span className="legend-item gate">Gate / Logic</span>
          <span className="legend-item reg">Register / DFF</span>
        </div>
      </div>

      <div className="lf-schematic-svg-container">
        <svg width="100%" height="340px" className="lf-schematic-svg">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Render Connections */}
          {edges.map((e, idx) => {
            const src = nodes.find((n) => n.id === e.fromNode);
            const dst = nodes.find((n) => n.id === e.toNode);
            if (!src || !dst) return null;

            const x1 = src.x + src.width;
            const y1 = src.y + src.height / 2;
            const x2 = dst.x;
            const y2 = dst.y + dst.height / 2;
            const midX = (x1 + x2) / 2;

            return (
              <path
                key={idx}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id;
            let fill = '#1e293b';
            let stroke = '#475569';

            if (node.type === 'PORT') {
              fill = '#0f2942';
              stroke = '#38bdf8';
            } else if (node.type === 'REGISTER') {
              fill = '#2a1b4e';
              stroke = '#c084fc';
            } else if (node.type === 'GATE') {
              fill = '#143828';
              stroke = '#4ade80';
            }

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="6"
                  fill={fill}
                  stroke={isSelected ? '#f43f5e' : stroke}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />
                <text
                  x={node.x + 12}
                  y={node.y + 24}
                  fill="#f8fafc"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.label.split('\n')[0]}
                </text>
                {node.label.includes('\n') && (
                  <text
                    x={node.x + 12}
                    y={node.y + 42}
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {node.label.split('\n')[1]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

