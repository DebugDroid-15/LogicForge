import React from 'react';

export type WorkspaceTab =
  | 'HOME'
  | 'DESIGN'
  | 'ANALYSIS'
  | 'SIMULATION'
  | 'SYNTHESIS'
  | 'IMPLEMENTATION'
  | 'TIMING'
  | 'FORMAL'
  | 'IP_CATALOG'
  | 'HARDWARE'
  | 'REPORTS'
  | 'SETTINGS';

interface NavigationHeaderProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  statusText: string;
  statusColor: string;
  onRunAction: (action: string) => void;
  isBuilding: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onTabChange,
  statusText,
  statusColor,
  onRunAction,
  isBuilding,
}) => {
  const tabs: WorkspaceTab[] = [
    'HOME',
    'DESIGN',
    'ANALYSIS',
    'SIMULATION',
    'SYNTHESIS',
    'IMPLEMENTATION',
    'TIMING',
    'FORMAL',
    'IP_CATALOG',
    'HARDWARE',
    'REPORTS',
    'SETTINGS',
  ];

  return (
    <header className="lf-header">
      <div className="lf-brand">
        <span className="lf-logo-icon">❖</span>
        <span className="lf-logo-title">LOGICFORGE</span>
        <span className="lf-version">v0.1.0</span>
      </div>

      <nav className="lf-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`lf-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="lf-command-center">
        <button
          className="lf-cmd-btn analyze"
          disabled={isBuilding}
          onClick={() => onRunAction('ANALYZE')}
        >
          ANALYZE
        </button>
        <button
          className="lf-cmd-btn synth"
          disabled={isBuilding}
          onClick={() => onRunAction('SYNTHESIZE')}
        >
          SYNTHESIZE
        </button>
        <button
          className="lf-cmd-btn sim"
          disabled={isBuilding}
          onClick={() => onRunAction('SIMULATE')}
        >
          SIMULATE
        </button>

        <div className="lf-status-badge">
          <span className="lf-status-dot" style={{ backgroundColor: statusColor }} />
          <span className="lf-status-text">{statusText}</span>
        </div>
      </div>
    </header>
  );
};

