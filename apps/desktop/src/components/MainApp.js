import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NavigationHeader } from './NavigationHeader.js';
import { WaveformViewer } from './WaveformViewer.js';
import { SchematicViewer } from './SchematicViewer.js';
import { PinPlanner } from './PinPlanner.js';
import { BuildComparison } from './BuildComparison.js';
import { HardwareManager } from './HardwareManager.js';
export const MainApp = () => {
    const [activeTab, setActiveTab] = useState('DESIGN');
    const [activeBottomPanel, setActiveBottomPanel] = useState('BUILD');
    const [statusText, setStatusText] = useState('● Ready');
    const [statusColor, setStatusColor] = useState('#4ade80');
    const [isBuilding, setIsBuilding] = useState(false);
    const [selectedFile, setSelectedFile] = useState('rtl/top.v');
    const [editorContent, setEditorContent] = useState(`// LogicForge Verilog Top Module: Blink LED
module top (
    input wire clk,
    output reg led
);
    reg [23:0] counter = 24'd0;

    always @(posedge clk) begin
        counter <= counter + 1'b1;
        if (counter == 24'd12_000_000) begin
            counter <= 24'd0;
            led <= ~led;
        end
    end
endmodule
`);
    const [buildLogs, setBuildLogs] = useState(['[INFO] LogicForge Engine Initialized.', '[INFO] Target Device: Lattice iCE40HX1K-TQ144', '[INFO] Selected Toolchain: Icarus Verilog + Yosys + nextpnr']);
    const handleRunAction = async (action) => {
        setIsBuilding(true);
        setStatusText(`● Running ${action}...`);
        setStatusColor('#38bdf8');
        setBuildLogs((prev) => [...prev, `\n=== STARTING ${action} PIPELINE ===`]);
        setTimeout(() => {
            setIsBuilding(false);
            setStatusText(`● ${action} Complete`);
            setStatusColor('#4ade80');
            setBuildLogs((prev) => [
                ...prev,
                `[SUCCESS] ${action} finished cleanly with 0 errors, 1 warning.`,
                `[REPORT] Resource Utilization: LUTs: 18/1280 (1%), Flip-Flops: 25/1280 (2%), IOs: 2/96 (2%)`,
            ]);
        }, 1200);
    };
    return (_jsxs("div", { className: "lf-app-shell", children: [_jsx(NavigationHeader, { activeTab: activeTab, onTabChange: setActiveTab, statusText: statusText, statusColor: statusColor, onRunAction: handleRunAction, isBuilding: isBuilding }), _jsxs("div", { className: "lf-workspace-container", children: [activeTab === 'HOME' && (_jsxs("div", { className: "lf-home-dashboard", children: [_jsx("h2", { children: "WELCOME TO LOGICFORGE" }), _jsx("p", { children: "Lightweight, Modern, Cross-Platform FPGA Development Environment." }), _jsxs("div", { className: "lf-home-grid", children: [_jsxs("div", { className: "lf-card", children: [_jsx("h3", { children: "Recent Projects" }), _jsxs("ul", { children: [_jsx("li", { children: "\u25B8 01_blink_led (iCEstick / iCE40HX1K)" }), _jsx("li", { children: "\u25B8 02_counter_8bit (Generic Verilog)" }), _jsx("li", { children: "\u25B8 04_uart_transceiver (SystemVerilog)" })] })] }), _jsxs("div", { className: "lf-card", children: [_jsx("h3", { children: "Toolchain Status" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2713 Icarus Verilog v12.0 \u2014 Available" }), _jsx("li", { children: "\u2713 Yosys 0.38 \u2014 Available" }), _jsx("li", { children: "\u2713 nextpnr-ice40 v0.7 \u2014 Available" }), _jsx("li", { children: "\u2713 openFPGALoader \u2014 Available" })] })] }), _jsxs("div", { className: "lf-card", children: [_jsx("h3", { children: "Project Health" }), _jsx("p", { className: "health-pass", children: "\u2713 HDL Parsing Clean" }), _jsx("p", { className: "health-pass", children: "\u2713 Simulation Passing" }), _jsx("p", { className: "health-pass", children: "\u2713 Synthesis Netlist Generated" }), _jsx("p", { className: "health-warn", children: "\u26A0 Timing Margin Low (+0.41ns)" })] })] })] })), activeTab === 'DESIGN' && (_jsxs("div", { className: "lf-design-split", children: [_jsxs("div", { className: "lf-sidebar-explorer", children: [_jsx("div", { className: "lf-panel-header", children: "PROJECT HIERARCHY" }), _jsxs("ul", { className: "lf-file-tree", children: [_jsx("li", { className: selectedFile === 'rtl/top.v' ? 'active' : '', onClick: () => setSelectedFile('rtl/top.v'), children: "\uD83D\uDCC4 rtl/top.v" }), _jsx("li", { className: selectedFile === 'sim/tb_top.v' ? 'active' : '', onClick: () => setSelectedFile('sim/tb_top.v'), children: "\uD83E\uDDEA sim/tb_top.v" }), _jsx("li", { className: selectedFile === 'constraints/pins.xdc' ? 'active' : '', onClick: () => setSelectedFile('constraints/pins.xdc'), children: "\uD83D\uDCCC constraints/pins.xdc" })] })] }), _jsxs("div", { className: "lf-editor-container", children: [_jsx("div", { className: "lf-editor-header", children: _jsx("span", { className: "file-tab active", children: selectedFile }) }), _jsx("textarea", { className: "lf-code-editor", value: editorContent, onChange: (e) => setEditorContent(e.target.value), spellCheck: false })] }), _jsx("div", { className: "lf-right-schematic", children: _jsx(SchematicViewer, {}) })] })), activeTab === 'SIMULATION' && (_jsx("div", { className: "lf-sim-workspace", children: _jsx(WaveformViewer, {}) })), activeTab === 'SYNTHESIS' && (_jsxs("div", { className: "lf-synth-workspace", children: [_jsxs("div", { className: "lf-utilization-panel", children: [_jsx("h3", { children: "RESOURCE UTILIZATION METRICS" }), _jsxs("div", { className: "lf-util-bar", children: [_jsx("label", { children: "LUTs (4-input)" }), _jsx("div", { className: "bar-bg", children: _jsx("div", { className: "bar-fill", style: { width: '15%' } }) }), _jsx("span", { children: "18 / 1280 (1%)" })] }), _jsxs("div", { className: "lf-util-bar", children: [_jsx("label", { children: "Flip-Flops" }), _jsx("div", { className: "bar-bg", children: _jsx("div", { className: "bar-fill", style: { width: '25%' } }) }), _jsx("span", { children: "25 / 1280 (2%)" })] }), _jsxs("div", { className: "lf-util-bar", children: [_jsx("label", { children: "Block RAM" }), _jsx("div", { className: "bar-bg", children: _jsx("div", { className: "bar-fill", style: { width: '0%' } }) }), _jsx("span", { children: "0 / 16 (0%)" })] }), _jsxs("div", { className: "lf-util-bar", children: [_jsx("label", { children: "I/O Pins" }), _jsx("div", { className: "bar-bg", children: _jsx("div", { className: "bar-fill", style: { width: '10%' } }) }), _jsx("span", { children: "2 / 96 (2%)" })] })] }), _jsx(SchematicViewer, {})] })), activeTab === 'IMPLEMENTATION' && _jsx(PinPlanner, {}), activeTab === 'HARDWARE' && _jsx(HardwareManager, {}), activeTab === 'REPORTS' && _jsx(BuildComparison, {})] }), _jsxs("footer", { className: "lf-bottom-panel", children: [_jsxs("div", { className: "lf-bottom-tabs", children: [_jsx("button", { className: activeBottomPanel === 'BUILD' ? 'active' : '', onClick: () => setActiveBottomPanel('BUILD'), children: "BUILD CONSOLE" }), _jsx("button", { className: activeBottomPanel === 'PROBLEMS' ? 'active' : '', onClick: () => setActiveBottomPanel('PROBLEMS'), children: "PROBLEMS (0)" }), _jsx("button", { className: activeBottomPanel === 'REPORTS' ? 'active' : '', onClick: () => setActiveBottomPanel('REPORTS'), children: "REPORTS" }), _jsx("button", { className: activeBottomPanel === 'WAVEFORMS' ? 'active' : '', onClick: () => setActiveBottomPanel('WAVEFORMS'), children: "WAVEFORMS" })] }), _jsx("div", { className: "lf-bottom-content", children: buildLogs.map((log, i) => (_jsx("div", { className: "lf-console-line", children: log }, i))) })] })] }));
};
//# sourceMappingURL=MainApp.js.map