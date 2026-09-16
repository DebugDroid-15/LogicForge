import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const NavigationHeader = ({ activeCategory, activeSub, onCategoryChange, onSubChange, statusText, statusColor, onRunAction, isBuilding, onToggleCommandPalette, }) => {
    const mainCategories = ['HOME', 'DESIGN', 'VERIFY', 'BUILD', 'ANALYZE', 'HARDWARE', 'REPORTS', 'SETTINGS'];
    const subWorkspaces = {
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
    return (_jsxs("div", { className: "lf-header-container", children: [_jsxs("header", { className: "lf-header", children: [_jsxs("div", { className: "lf-brand", children: [_jsx("span", { className: "lf-logo-icon", children: "\u2756" }), _jsx("span", { className: "lf-logo-title", children: "LOGICFORGE" }), _jsx("span", { className: "lf-version", children: "v1.0.0" })] }), _jsx("nav", { className: "lf-main-tabs", children: mainCategories.map((cat) => (_jsx("button", { className: `lf-main-tab ${activeCategory === cat ? 'active' : ''}`, onClick: () => {
                                onCategoryChange(cat);
                                onSubChange(subWorkspaces[cat][0].sub);
                            }, children: cat }, cat))) }), _jsxs("div", { className: "lf-command-center", children: [_jsx("button", { className: "lf-cmd-palette-btn", onClick: onToggleCommandPalette, title: "Command Palette (Ctrl+Shift+P)", children: "\u2318 Command Palette" }), _jsx("button", { className: "lf-cmd-btn analyze", disabled: isBuilding, onClick: () => onRunAction('ANALYZE'), children: "\u25B6 ANALYZE" }), _jsx("button", { className: "lf-cmd-btn sim", disabled: isBuilding, onClick: () => onRunAction('SIMULATE'), children: "\u25B6 SIMULATE" }), _jsx("button", { className: "lf-cmd-btn synth", disabled: isBuilding, onClick: () => onRunAction('BUILD'), children: "\u26A1 BUILD FPGA" }), _jsxs("div", { className: "lf-status-badge", children: [_jsx("span", { className: "lf-status-dot", style: { backgroundColor: statusColor } }), _jsx("span", { className: "lf-status-text", children: statusText })] })] })] }), _jsxs("div", { className: "lf-sub-bar", children: [_jsxs("span", { className: "lf-sub-category", children: [activeCategory, " /"] }), _jsx("div", { className: "lf-sub-tabs", children: subWorkspaces[activeCategory].map((item) => (_jsx("button", { className: `lf-sub-tab ${activeSub === item.sub ? 'active' : ''}`, onClick: () => onSubChange(item.sub), children: item.label }, item.sub))) })] })] }));
};
//# sourceMappingURL=NavigationHeader.js.map