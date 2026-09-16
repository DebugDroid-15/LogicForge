import React from 'react';
export type MainCategory = 'HOME' | 'DESIGN' | 'VERIFY' | 'BUILD' | 'ANALYZE' | 'HARDWARE' | 'REPORTS' | 'SETTINGS';
export type SubWorkspace = 'HOME_DASHBOARD' | 'RTL_EDITOR' | 'PROJECT_EXPLORER' | 'SIMULATION' | 'WAVEFORMS' | 'FORMAL' | 'SYNTHESIS' | 'IMPLEMENTATION' | 'TIMING' | 'BITSTREAM' | 'RTL_INTELLIGENCE' | 'DESIGN_GRAPH' | 'FSM' | 'CDC' | 'RESET' | 'RESOURCES' | 'IP_CATALOG' | 'BLOCK_DESIGN' | 'CONSTRAINTS' | 'BOARDS' | 'PROGRAM' | 'SERIAL' | 'DEBUG' | 'REPORTS_CENTER' | 'BUILD_COMPARISON' | 'SETTINGS_GENERAL' | 'TOOLCHAIN_MANAGER';
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
export declare const NavigationHeader: React.FC<NavigationHeaderProps>;
export {};
//# sourceMappingURL=NavigationHeader.d.ts.map