import React, { useState } from 'react';
import { NavigationHeader, WorkspaceTab } from './NavigationHeader.js';
import { WaveformViewer } from './WaveformViewer.js';
import { SchematicViewer } from './SchematicViewer.js';
import { PinPlanner } from './PinPlanner.js';
import { BuildComparison } from './BuildComparison.js';
import { HardwareManager } from './HardwareManager.js';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('DESIGN');
  const [activeBottomPanel, setActiveBottomPanel] = useState<'PROBLEMS' | 'BUILD' | 'REPORTS' | 'WAVEFORMS'>('BUILD');
  const [statusText, setStatusText] = useState<string>('● Ready');
  const [statusColor, setStatusColor] = useState<string>('#4ade80');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>('rtl/top.v');

  const [editorContent, setEditorContent] = useState<string>(
`// LogicForge Verilog Top Module: Blink LED
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
`
  );

  const [buildLogs, setBuildLogs] = useState<string[]>(
    ['[INFO] LogicForge Engine Initialized.', '[INFO] Target Device: Lattice iCE40HX1K-TQ144', '[INFO] Selected Toolchain: Icarus Verilog + Yosys + nextpnr']
  );

  const handleRunAction = async (action: string) => {
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

  return (
    <div className="lf-app-shell">
      <NavigationHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusText={statusText}
        statusColor={statusColor}
        onRunAction={handleRunAction}
        isBuilding={isBuilding}
      />

      <div className="lf-workspace-container">
        {activeTab === 'HOME' && (
          <div className="lf-home-dashboard">
            <h2>WELCOME TO LOGICFORGE</h2>
            <p>Lightweight, Modern, Cross-Platform FPGA Development Environment.</p>

            <div className="lf-home-grid">
              <div className="lf-card">
                <h3>Recent Projects</h3>
                <ul>
                  <li>▸ 01_blink_led (iCEstick / iCE40HX1K)</li>
                  <li>▸ 02_counter_8bit (Generic Verilog)</li>
                  <li>▸ 04_uart_transceiver (SystemVerilog)</li>
                </ul>
              </div>

              <div className="lf-card">
                <h3>Toolchain Status</h3>
                <ul>
                  <li>✓ Icarus Verilog v12.0 — Available</li>
                  <li>✓ Yosys 0.38 — Available</li>
                  <li>✓ nextpnr-ice40 v0.7 — Available</li>
                  <li>✓ openFPGALoader — Available</li>
                </ul>
              </div>

              <div className="lf-card">
                <h3>Project Health</h3>
                <p className="health-pass">✓ HDL Parsing Clean</p>
                <p className="health-pass">✓ Simulation Passing</p>
                <p className="health-pass">✓ Synthesis Netlist Generated</p>
                <p className="health-warn">⚠ Timing Margin Low (+0.41ns)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DESIGN' && (
          <div className="lf-design-split">
            <div className="lf-sidebar-explorer">
              <div className="lf-panel-header">PROJECT HIERARCHY</div>
              <ul className="lf-file-tree">
                <li className={selectedFile === 'rtl/top.v' ? 'active' : ''} onClick={() => setSelectedFile('rtl/top.v')}>
                  📄 rtl/top.v
                </li>
                <li className={selectedFile === 'sim/tb_top.v' ? 'active' : ''} onClick={() => setSelectedFile('sim/tb_top.v')}>
                  🧪 sim/tb_top.v
                </li>
                <li className={selectedFile === 'constraints/pins.xdc' ? 'active' : ''} onClick={() => setSelectedFile('constraints/pins.xdc')}>
                  📌 constraints/pins.xdc
                </li>
              </ul>
            </div>

            <div className="lf-editor-container">
              <div className="lf-editor-header">
                <span className="file-tab active">{selectedFile}</span>
              </div>
              <textarea
                className="lf-code-editor"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="lf-right-schematic">
              <SchematicViewer />
            </div>
          </div>
        )}

        {activeTab === 'SIMULATION' && (
          <div className="lf-sim-workspace">
            <WaveformViewer />
          </div>
        )}

        {activeTab === 'SYNTHESIS' && (
          <div className="lf-synth-workspace">
            <div className="lf-utilization-panel">
              <h3>RESOURCE UTILIZATION METRICS</h3>
              <div className="lf-util-bar">
                <label>LUTs (4-input)</label>
                <div className="bar-bg"><div className="bar-fill" style={{ width: '15%' }} /></div>
                <span>18 / 1280 (1%)</span>
              </div>

              <div className="lf-util-bar">
                <label>Flip-Flops</label>
                <div className="bar-bg"><div className="bar-fill" style={{ width: '25%' }} /></div>
                <span>25 / 1280 (2%)</span>
              </div>

              <div className="lf-util-bar">
                <label>Block RAM</label>
                <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }} /></div>
                <span>0 / 16 (0%)</span>
              </div>

              <div className="lf-util-bar">
                <label>I/O Pins</label>
                <div className="bar-bg"><div className="bar-fill" style={{ width: '10%' }} /></div>
                <span>2 / 96 (2%)</span>
              </div>
            </div>

            <SchematicViewer />
          </div>
        )}

        {activeTab === 'IMPLEMENTATION' && <PinPlanner />}
        {activeTab === 'HARDWARE' && <HardwareManager />}
        {activeTab === 'REPORTS' && <BuildComparison />}
      </div>

      <footer className="lf-bottom-panel">
        <div className="lf-bottom-tabs">
          <button className={activeBottomPanel === 'BUILD' ? 'active' : ''} onClick={() => setActiveBottomPanel('BUILD')}>
            BUILD CONSOLE
          </button>
          <button className={activeBottomPanel === 'PROBLEMS' ? 'active' : ''} onClick={() => setActiveBottomPanel('PROBLEMS')}>
            PROBLEMS (0)
          </button>
          <button className={activeBottomPanel === 'REPORTS' ? 'active' : ''} onClick={() => setActiveBottomPanel('REPORTS')}>
            REPORTS
          </button>
          <button className={activeBottomPanel === 'WAVEFORMS' ? 'active' : ''} onClick={() => setActiveBottomPanel('WAVEFORMS')}>
            WAVEFORMS
          </button>
        </div>

        <div className="lf-bottom-content">
          {buildLogs.map((log, i) => (
            <div key={i} className="lf-console-line">
              {log}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

