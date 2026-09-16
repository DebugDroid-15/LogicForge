import React from 'react';

export type MainCategory = 'HOME' | 'DESIGN' | 'VERIFY' | 'BUILD' | 'ANALYZE' | 'HARDWARE' | 'REPORTS' | 'SETTINGS';

export type SubWorkspace =
  | 'HOME_DASHBOARD'
  | 'RTL_EDITOR'
  | 'PROJECT_EXPLORER'
  | 'SIMULATION'
  | 'WAVEFORMS'
  | 'FORMAL'
  | 'SYNTHESIS'
  | 'IMPLEMENTATION'
  | 'TIMING'
  | 'BITSTREAM'
  | 'RTL_INTELLIGENCE'
  | 'DESIGN_GRAPH'
  | 'FSM'
  | 'CDC'
  | 'RESET'
  | 'RESOURCES'
  | 'IP_CATALOG'
  | 'BLOCK_DESIGN'
  | 'CONSTRAINTS'
  | 'BOARDS'
  | 'PROGRAM'
  | 'SERIAL'
  | 'DEBUG'
  | 'REPORTS_CENTER'
  | 'BUILD_COMPARISON'
  | 'SETTINGS_GENERAL'
  | 'TOOLCHAIN_MANAGER';

interface NavigationHeaderProps {
  activeCategory: MainCategory;
  activeSub: SubWorkspace;
  onCategoryChange: (cat: MainCategory) => void;
  onSubChange: (sub: SubWorkspace) => void;
  statusText: string;
  statusColor: string;
  onRunAction: (action: string) => void;
  isBuilding: boolean;
  onToggleCommandPalette: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeCategory,
  activeSub,
  onCategoryChange,
  onSubChange,
  statusText,
  statusColor,
  onRunAction,
  isBuilding,
  onToggleCommandPalette,
}) => {
  const mainCategories: MainCategory[] = ['HOME', 'DESIGN', 'VERIFY', 'BUILD', 'ANALYZE', 'HARDWARE', 'REPORTS', 'SETTINGS'];

  const subWorkspaces: Record<MainCategory, { label: string; sub: SubWorkspace }[]> = {
    HOME: [{ label: 'Dashboard', sub: 'HOME_DASHBOARD' }],
    DESIGN: [
      { label: 'RTL Editor', sub: 'RTL_EDITOR' },
      { label: 'IP Catalog', sub: 'IP_CATALOG' },
      { label: 'Block Design', sub: 'BLOCK_DESIGN' },
      { label: 'Pin Planner / Constraints', sub: 'CONSTRAINTS' },
    ],
    VERIFY: [
      { label: 'Simulation Engine', sub: 'SIMULATION' },
      { label: 'Waveform Viewer', sub: 'WAVEFORMS' },
      { label: 'Formal Verification', sub: 'FORMAL' },
    ],
    BUILD: [
      { label: 'Synthesis (Yosys)', sub: 'SYNTHESIS' },
      { label: 'Implementation (nextpnr)', sub: 'IMPLEMENTATION' },
      { label: 'Timing Analysis', sub: 'TIMING' },
      { label: 'Bitstream Generation', sub: 'BITSTREAM' },
    ],
    ANALYZE: [
      { label: 'RTL Diagnostics', sub: 'RTL_INTELLIGENCE' },
      { label: 'Design Graph Hierarchy', sub: 'DESIGN_GRAPH' },
      { label: 'FSM Extraction', sub: 'FSM' },
      { label: 'Clock Domain Crossings (CDC)', sub: 'CDC' },
      { label: 'Reset Domain Trees', sub: 'RESET' },
      { label: 'Resource Utilization', sub: 'RESOURCES' },
    ],
    HARDWARE: [
      { label: 'Board Discovery', sub: 'BOARDS' },
      { label: 'FPGA Flasher', sub: 'PROGRAM' },
      { label: 'UART Serial Terminal', sub: 'SERIAL' },
      { label: 'Hardware Debug Session', sub: 'DEBUG' },
    ],
    REPORTS: [
      { label: 'Build Reports Center', sub: 'REPORTS_CENTER' },
      { label: 'Build Comparison Delta', sub: 'BUILD_COMPARISON' },
    ],
    SETTINGS: [
      { label: 'Environment Preferences', sub: 'SETTINGS_GENERAL' },
      { label: 'Toolchain Manager', sub: 'TOOLCHAIN_MANAGER' },
    ],
  };

  return (
    <div className="lf-header-container">
      {/* Native Desktop Window Menu & Header */}
      <header className="lf-header">
        <div className="lf-brand">
          <span className="lf-logo-icon">❖</span>
          <span className="lf-logo-title">LOGICFORGE</span>
          <span className="lf-version">v1.0.0</span>
        </div>

        <nav className="lf-main-tabs">
          {mainCategories.map((cat) => (
            <button
              key={cat}
              className={`lf-main-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                onCategoryChange(cat);
                onSubChange(subWorkspaces[cat][0].sub);
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="lf-command-center">
          <button className="lf-cmd-palette-btn" onClick={onToggleCommandPalette} title="Command Palette (Ctrl+Shift+P)">
            ⌘ Command Palette
          </button>
          <button className="lf-cmd-btn analyze" disabled={isBuilding} onClick={() => onRunAction('ANALYZE')}>
            ▶ ANALYZE
          </button>
          <button className="lf-cmd-btn sim" disabled={isBuilding} onClick={() => onRunAction('SIMULATE')}>
            ▶ SIMULATE
          </button>
          <button className="lf-cmd-btn synth" disabled={isBuilding} onClick={() => onRunAction('BUILD')}>
            ⚡ BUILD FPGA
          </button>

          <div className="lf-status-badge">
            <span className="lf-status-dot" style={{ backgroundColor: statusColor }} />
            <span className="lf-status-text">{statusText}</span>
          </div>
        </div>
      </header>

      {/* Sub-Workspace Breadcrumb Bar */}
      <div className="lf-sub-bar">
        <span className="lf-sub-category">{activeCategory} /</span>
        <div className="lf-sub-tabs">
          {subWorkspaces[activeCategory].map((item) => (
            <button
              key={item.sub}
              className={`lf-sub-tab ${activeSub === item.sub ? 'active' : ''}`}
              onClick={() => onSubChange(item.sub)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
