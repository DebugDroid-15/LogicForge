import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { NetlistParser } from '@logicforge/schematic';
export const SchematicViewer = ({ netlistJson }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [topModule, setTopModule] = useState('top');
    useEffect(() => {
        if (netlistJson) {
            try {
                const parsed = NetlistParser.parseYosysJson(netlistJson);
                setNodes(parsed.nodes);
                setEdges(parsed.edges);
                setTopModule(parsed.topModule);
            }
            catch (err) {
                console.error('Failed to parse netlist JSON:', err);
            }
        }
        else {
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
    return (_jsxs("div", { className: "lf-schematic-panel", children: [_jsxs("div", { className: "lf-schematic-toolbar", children: [_jsxs("span", { className: "lf-panel-title", children: ["RTL SCHEMATIC VISUALIZER \u2014 [", topModule, "]"] }), _jsxs("div", { className: "lf-schematic-legend", children: [_jsx("span", { className: "legend-item port", children: "Port" }), _jsx("span", { className: "legend-item gate", children: "Gate / Logic" }), _jsx("span", { className: "legend-item reg", children: "Register / DFF" })] })] }), _jsx("div", { className: "lf-schematic-svg-container", children: _jsxs("svg", { width: "100%", height: "340px", className: "lf-schematic-svg", children: [_jsx("defs", { children: _jsx("marker", { id: "arrow", viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse", children: _jsx("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#0284c7" }) }) }), edges.map((e, idx) => {
                            const src = nodes.find((n) => n.id === e.fromNode);
                            const dst = nodes.find((n) => n.id === e.toNode);
                            if (!src || !dst)
                                return null;
                            const x1 = src.x + src.width;
                            const y1 = src.y + src.height / 2;
                            const x2 = dst.x;
                            const y2 = dst.y + dst.height / 2;
                            const midX = (x1 + x2) / 2;
                            return (_jsx("path", { d: `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`, fill: "none", stroke: "#0284c7", strokeWidth: "2", markerEnd: "url(#arrow)" }, idx));
                        }), nodes.map((node) => {
                            const isSelected = selectedNode === node.id;
                            let fill = '#1e293b';
                            let stroke = '#475569';
                            if (node.type === 'PORT') {
                                fill = '#0f2942';
                                stroke = '#38bdf8';
                            }
                            else if (node.type === 'REGISTER') {
                                fill = '#2a1b4e';
                                stroke = '#c084fc';
                            }
                            else if (node.type === 'GATE') {
                                fill = '#143828';
                                stroke = '#4ade80';
                            }
                            return (_jsxs("g", { onClick: () => setSelectedNode(node.id), style: { cursor: 'pointer' }, children: [_jsx("rect", { x: node.x, y: node.y, width: node.width, height: node.height, rx: "6", fill: fill, stroke: isSelected ? '#f43f5e' : stroke, strokeWidth: isSelected ? '2.5' : '1.5' }), _jsx("text", { x: node.x + 12, y: node.y + 24, fill: "#f8fafc", fontSize: "12", fontFamily: "monospace", fontWeight: "600", children: node.label.split('\n')[0] }), node.label.includes('\n') && (_jsx("text", { x: node.x + 12, y: node.y + 42, fill: "#94a3b8", fontSize: "11", fontFamily: "monospace", children: node.label.split('\n')[1] }))] }, node.id));
                        })] }) })] }));
};
//# sourceMappingURL=SchematicViewer.js.map