import React from 'react';
export type WorkspaceTab = 'HOME' | 'DESIGN' | 'ANALYSIS' | 'SIMULATION' | 'SYNTHESIS' | 'IMPLEMENTATION' | 'TIMING' | 'FORMAL' | 'IP_CATALOG' | 'HARDWARE' | 'REPORTS' | 'SETTINGS';
interface NavigationHeaderProps {
    activeTab: WorkspaceTab;
    onTabChange: (tab: WorkspaceTab) => void;
    statusText: string;
    statusColor: string;
    onRunAction: (action: string) => void;
    isBuilding: boolean;
}
export declare const NavigationHeader: React.FC<NavigationHeaderProps>;
export {};
//# sourceMappingURL=NavigationHeader.d.ts.map