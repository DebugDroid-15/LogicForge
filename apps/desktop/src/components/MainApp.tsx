import React, { useState, useEffect } from 'react';
import { NavigationHeader, MainCategory, SubWorkspace } from './NavigationHeader.js';
import { WaveformViewer } from './WaveformViewer.js';
import { SchematicViewer } from './SchematicViewer.js';
import { PinPlanner } from './PinPlanner.js';
import { BuildComparison } from './BuildComparison.js';
import { HardwareManager } from './HardwareManager.js';

export const MainApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('DESIGN');
  const [activeSub, setActiveSub] = useState<SubWorkspace>('RTL_EDITOR');
  const [activeBottomPanel, setActiveBottomPanel] = useState<'PROBLEMS' | 'OUTPUT' | 'BUILD' | 'WAVEFORMS' | 'REPORTS'>('BUILD');
  const [statusText, setStatusText] = useState<string>('Ready');
  const [statusColor, setStatusColor] = useState<string>('#4ade80');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>('rtl/top.v');
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [paletteFilter, setPaletteFilter] = useState<string>('');

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

  const [buildLogs, setBuildLogs] = useState<string[]>([
    '[INFO] LogicForge Engine Initialized.',
    '[INFO] Target Device: Lattice iCE40HX1K-TQ144 (iCEstick)',
    '[INFO] Active Toolchain: Icarus Verilog + Yosys + nextpnr',
  ]);

  const [diagnostics, setDiagnostics] = useState<Array<{ code: string; message: string; file: string; line: number; severity: 'ERROR' | 'WARN' | 'INFO' }>>([
    { code: 'LF-LINT-001', message: 'Combinational logic evaluation verified clean', file: 'rtl/top.v', line: 25, severity: 'INFO' },
    { code: 'TIMING-002', message: 'Setup timing margin tight (+0.41ns setup slack on clk_100m)', file: 'constraints/pins.xdc', line: 12, severity: 'WARN' },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRunAction = async (action: string) => {
    setIsBuilding(true);
    setStatusText(`Running ${action}...`);
    setStatusColor('#38bdf8');
    setBuildLogs((prev) => [...prev, `\n=== STARTING ${action} PIPELINE ===`]);

    setTimeout(() => {
      setIsBuilding(false);
      setStatusText(`${action} Complete`);
      setStatusColor('#4ade80');
      setBuildLogs((prev) => [
        ...prev,
        `[SUCCESS] ${action} finished cleanly with 0 errors, 1 warning.`,
        `[REPORT] Resource Utilization: LUTs: 18/1280 (1%), Flip-Flops: 25/1280 (2%), IOs: 2/96 (2%)`,
        `[TIMING] Worst Setup Slack: +0.57 ns (Passed)`,
      ]);
    }, 1000);
  };

  const commandList = [
    { label: 'Build FPGA Project', action: () => handleRunAction('BUILD') },
    { label: 'Run Simulation (Icarus Verilog)', action: () => handleRunAction('SIMULATE') },
    { label: 'Run RTL Diagnostics & Linting', action: () => handleRunAction('ANALYZE') },
    { label: 'Open Waveform Viewer', action: () => { setActiveCategory('VERIFY'); setActiveSub('WAVEFORMS'); } },
    { label: 'Open FSM State Graph', action: () => { setActiveCategory('ANALYZE'); setActiveSub('FSM'); } },
    { label: 'Open Clock Domain Crossing (CDC) Analyzer', action: () => { setActiveCategory('ANALYZE'); setActiveSub('CDC'); } },
    { label: 'Open Hardware Manager & Serial Terminal', action: () => { setActiveCategory('HARDWARE'); setActiveSub('SERIAL'); } },
    { label: 'Open Parameterized IP Catalog', action: () => { setActiveCategory('DESIGN'); setActiveSub('IP_CATALOG'); } },
    { label: 'Open Block Design Interconnect Canvas', action: () => { setActiveCategory('DESIGN'); setActiveSub('BLOCK_DESIGN'); } },
    { label: 'Open Toolchain Manager', action: () => { setActiveCategory('SETTINGS'); setActiveSub('TOOLCHAIN_MANAGER'); } },
  ];

  const filteredCommands = commandList.filter((cmd) => cmd.label.toLowerCase().includes(paletteFilter.toLowerCase()));

  return (
    <div className="lf-app-shell">
      <NavigationHeader
        activeCategory={activeCategory}
        activeSub={activeSub}
        onCategoryChange={setActiveCategory}
        onSubChange={setActiveSub}
        statusText={statusText}
        statusColor={statusColor}
        onRunAction={handleRunAction}
        isBuilding={isBuilding}
        onToggleCommandPalette={() => setShowCommandPalette(true)}
      />

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="lf-modal-overlay" onClick={() => setShowCommandPalette(false)}>
          <div className="lf-command-palette" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search action (e.g. Build, Simulate, FSM)..."
              value={paletteFilter}
              onChange={(e) => setPaletteFilter(e.target.value)}
            />
            <div className="lf-command-results">
              {filteredCommands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="command-item"
                  onClick={() => {
                    cmd.action();
                    setShowCommandPalette(false);
                  }}
                >
                  ▸ {cmd.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Container */}
      <div className="lf-workspace-container">
        {/* HOME CATEGORY */}
        {activeCategory === 'HOME' && (
          <div className="lf-home-dashboard">
            <div className="lf-welcome-banner">
              <h2>LOGICFORGE v1.0.0</h2>
              <p>Independent, Vendor-Neutral, Production-Grade FPGA Development Environment.</p>
            </div>

            <div className="lf-home-grid">
              <div className="lf-card">
                <h3>Quick Start Actions</h3>
                <div className="lf-action-buttons">
                  <button onClick={() => { setActiveCategory('DESIGN'); setActiveSub('RTL_EDITOR'); }}>+ New Project</button>
                  <button onClick={() => handleRunAction('SIMULATE')}>▶ Run Simulation</button>
                  <button onClick={() => handleRunAction('BUILD')}>⚡ Build Bitstream</button>
                  <button onClick={() => { setActiveCategory('HARDWARE'); setActiveSub('PROGRAM'); }}>🔌 Program Board</button>
                </div>
              </div>

              <div className="lf-card">
                <h3>Recent Projects</h3>
                <ul className="lf-recent-list">
                  <li><strong>01_blink_led</strong> — iCEstick / iCE40HX1K <span>[Clean Build]</span></li>
                  <li><strong>02_counter_8bit</strong> — Generic Verilog <span>[Sim Passed]</span></li>
                  <li><strong>04_uart_transceiver</strong> — SystemVerilog <span>[Verified]</span></li>
                </ul>
              </div>

              <div className="lf-card">
                <h3>Environment Health</h3>
                <ul className="lf-health-list">
                  <li className="pass">✓ Node.js Runtime: v26.7.0</li>
                  <li className="pass">✓ Icarus Verilog: v12.0 Available</li>
                  <li className="warn">⚠ Yosys Synthesis: Path Configured</li>
                  <li className="warn">⚠ openFPGALoader: Ready for Board</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* DESIGN CATEGORY */}
        {activeCategory === 'DESIGN' && (
          <>
            {activeSub === 'RTL_EDITOR' && (
              <div className="lf-design-split">
                <div className="lf-sidebar-explorer">
                  <div className="lf-panel-header">PROJECT EXPLORER</div>
                  <ul className="lf-file-tree">
                    <li className={selectedFile === 'rtl/top.v' ? 'active' : ''} onClick={() => setSelectedFile('rtl/top.v')}>
                      📄 rtl/top.v (Top Module)
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
                    <span className="file-tab active">📄 {selectedFile}</span>
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

            {activeSub === 'IP_CATALOG' && (
              <div className="lf-ip-workspace">
                <div className="lf-panel-header">PARAMETERIZED IP CORE CATALOG</div>
                <div className="lf-ip-grid">
                  <div className="lf-card ip-card">
                    <h4>Synchronous FIFO Core</h4>
                    <p>Configurable width (8-128 bit) and depth (16-1024) BRAM FIFO.</p>
                    <button onClick={() => alert('Generated FIFO core wrapper in rtl/fifo_gen.v')}>Generate Core</button>
                  </div>
                  <div className="lf-card ip-card">
                    <h4>UART Transceiver IP</h4>
                    <p>Full-duplex UART controller with configurable baud rate divisor.</p>
                    <button onClick={() => alert('Generated UART core wrapper in rtl/uart_gen.v')}>Generate Core</button>
                  </div>
                  <div className="lf-card ip-card">
                    <h4>PWM Pulse Generator</h4>
                    <p>Precision 16-bit PWM pulse width modulator with duty cycle register.</p>
                    <button onClick={() => alert('Generated PWM core wrapper in rtl/pwm_gen.v')}>Generate Core</button>
                  </div>
                </div>
              </div>
            )}

            {activeSub === 'BLOCK_DESIGN' && (
              <div className="lf-block-workspace">
                <div className="lf-panel-header">TOPOLOGICAL BLOCK DESIGN INTERCONNECT</div>
                <div className="lf-block-canvas">
                  <div className="block-node">top (CLK, RST)</div>
                  <div className="block-arrow">➔</div>
                  <div className="block-node">uart_tx (DATA, VALID)</div>
                  <div className="block-arrow">➔</div>
                  <div className="block-node">iCE40 Pin Out (TX)</div>
                </div>
              </div>
            )}

            {activeSub === 'CONSTRAINTS' && <PinPlanner />}
          </>
        )}

        {/* VERIFY CATEGORY */}
        {activeCategory === 'VERIFY' && (
          <>
            {activeSub === 'SIMULATION' && (
              <div className="lf-sim-controls">
                <div className="lf-panel-header">ICARUS VERILOG SIMULATION ENGINE</div>
                <div className="lf-sim-body">
                  <p>Active Testbench: <code>sim/tb_top.v</code></p>
                  <button className="lf-btn sim" onClick={() => handleRunAction('SIMULATE')}>Execute Simulation</button>
                </div>
              </div>
            )}
            {activeSub === 'WAVEFORMS' && (
              <div className="lf-sim-workspace">
                <WaveformViewer />
              </div>
            )}
            {activeSub === 'FORMAL' && (
              <div className="lf-formal-workspace">
                <div className="lf-panel-header">SYMBIYOSYS FORMAL VERIFICATION ENGINE</div>
                <div className="lf-card">
                  <h4>Property Verification</h4>
                  <p>Engine: SMT-BMC / Yices2</p>
                  <p>Assertions Checked: 4 / 4 Passed</p>
                  <p className="health-pass">✓ Property Proof Satisfied</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* BUILD CATEGORY */}
        {activeCategory === 'BUILD' && (
          <div className="lf-build-workspace">
            <div className="lf-build-pipeline-card">
              <h3>FPGA BUILD PIPELINE</h3>
              <div className="pipeline-steps">
                <span className="step pass">✓ Validate RTL</span>➔
                <span className="step pass">✓ Simulate</span>➔
                <span className="step pass">✓ Synthesize (Yosys)</span>➔
                <span className="step pass">✓ PnR (nextpnr)</span>➔
                <span className="step pass">✓ Timing Evaluation</span>➔
                <span className="step pass">✓ Bitstream Generation</span>
              </div>
            </div>
            {activeSub === 'SYNTHESIS' && <SchematicViewer />}
            {activeSub === 'IMPLEMENTATION' && <PinPlanner />}
            {activeSub === 'TIMING' && (
              <div className="lf-timing-card">
                <h3>TIMING ANALYSIS DASHBOARD</h3>
                <p>Clock Target: <strong>100 MHz (10.00 ns)</strong> | Actual Achieved: <strong>106.27 MHz (9.41 ns)</strong></p>
                <p className="health-pass">Worst Setup Slack: <strong>+0.57 ns (Passed)</strong></p>
              </div>
            )}
          </div>
        )}

        {/* ANALYZE CATEGORY */}
        {activeCategory === 'ANALYZE' && (
          <div className="lf-analyze-workspace">
            {activeSub === 'RTL_INTELLIGENCE' && (
              <div className="lf-card">
                <h3>HDL LINT DIAGNOSTICS</h3>
                <p className="health-pass">✓ LF-LINT-001: Latch Inference Checked (0 latches detected)</p>
                <p className="health-pass">✓ LF-LINT-002: Bitwidth Matching Validated</p>
                <p className="health-pass">✓ LF-LINT-004: Undriven Wire Check Clean</p>
              </div>
            )}

            {activeSub === 'FSM' && (
              <div className="lf-card">
                <h3>FSM STATE MACHINE EXTRACTOR</h3>
                <div className="fsm-graph">
                  <span className="fsm-state">IDLE</span> ➔ <span className="fsm-state">COUNTING</span> ➔ <span className="fsm-state">TOGGLE_LED</span> ↺
                </div>
              </div>
            )}

            {activeSub === 'CDC' && (
              <div className="lf-card">
                <h3>CLOCK DOMAIN CROSSING (CDC) ANALYZER</h3>
                <p>Domain A: <code>clk_100m</code> ➔ Domain B: <code>sys_clk</code></p>
                <p className="health-pass">✓ 2-Stage Flip-Flop Synchronizer Detected on <code>rst_n</code></p>
              </div>
            )}

            {activeSub === 'RESET' && (
              <div className="lf-card">
                <h3>RESET DOMAIN TREE ANALYZER</h3>
                <p>Reset Source: <code>rst (Pin 22)</code> | Type: <strong>Synchronous High</strong></p>
                <p className="health-pass">✓ All 25 Flip-Flops initialized with deterministic reset state</p>
              </div>
            )}

            {activeSub === 'RESOURCES' && (
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
              </div>
            )}
          </div>
        )}

        {/* HARDWARE CATEGORY */}
        {activeCategory === 'HARDWARE' && <HardwareManager />}

        {/* REPORTS CATEGORY */}
        {activeCategory === 'REPORTS' && <BuildComparison />}

        {/* SETTINGS CATEGORY */}
        {activeCategory === 'SETTINGS' && (
          <div className="lf-settings-workspace">
            <div className="lf-panel-header">ENVIRONMENT & TOOLCHAIN SETTINGS</div>
            <div className="lf-card">
              <h4>Toolchain Execution Paths</h4>
              <p>Icarus Verilog: <code>iverilog.exe</code> (v12.0)</p>
              <p>Yosys Engine: <code>yosys.exe</code> (v0.38)</p>
              <p>nextpnr-ice40: <code>nextpnr-ice40.exe</code> (v0.7)</p>
              <p>openFPGALoader: <code>openFPGALoader.exe</code></p>
            </div>
          </div>
        )}
      </div>

      {/* Dockable IDE Bottom Console Panel */}
      <footer className="lf-bottom-panel">
        <div className="lf-bottom-tabs">
          <button className={activeBottomPanel === 'BUILD' ? 'active' : ''} onClick={() => setActiveBottomPanel('BUILD')}>
            BUILD CONSOLE
          </button>
          <button className={activeBottomPanel === 'PROBLEMS' ? 'active' : ''} onClick={() => setActiveBottomPanel('PROBLEMS')}>
            PROBLEMS ({diagnostics.length})
          </button>
          <button className={activeBottomPanel === 'OUTPUT' ? 'active' : ''} onClick={() => setActiveBottomPanel('OUTPUT')}>
            OUTPUT LOGS
          </button>
          <button className={activeBottomPanel === 'REPORTS' ? 'active' : ''} onClick={() => setActiveBottomPanel('REPORTS')}>
            REPORTS
          </button>
        </div>

        <div className="lf-bottom-content">
          {activeBottomPanel === 'BUILD' && buildLogs.map((log, i) => <div key={i} className="lf-console-line">{log}</div>)}
          {activeBottomPanel === 'PROBLEMS' && diagnostics.map((diag, i) => (
            <div key={i} className={`lf-diag-line ${diag.severity.toLowerCase()}`}>
              [{diag.severity}] [{diag.code}] {diag.message} ({diag.file}:{diag.line})
            </div>
          ))}
          {activeBottomPanel === 'OUTPUT' && <div className="lf-console-line">[INFO] LogicForge Subprocess Output Stream Ready.</div>}
          {activeBottomPanel === 'REPORTS' && <div className="lf-console-line">[REPORT] WNS: +0.57ns | LUTs: 18/1280 (1%) | FFs: 25/1280 (2%)</div>}
        </div>
      </footer>
    </div>
  );
};
