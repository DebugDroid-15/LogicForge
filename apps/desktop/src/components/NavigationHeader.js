import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const NavigationHeader = ({ activeTab, onTabChange, statusText, statusColor, onRunAction, isBuilding, }) => {
    const tabs = [
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
    return (_jsxs("header", { className: "lf-header", children: [_jsxs("div", { className: "lf-brand", children: [_jsx("span", { className: "lf-logo-icon", children: "\u2756" }), _jsx("span", { className: "lf-logo-title", children: "LOGICFORGE" }), _jsx("span", { className: "lf-version", children: "v0.1.0" })] }), _jsx("nav", { className: "lf-tabs", children: tabs.map((tab) => (_jsx("button", { className: `lf-tab ${activeTab === tab ? 'active' : ''}`, onClick: () => onTabChange(tab), children: tab }, tab))) }), _jsxs("div", { className: "lf-command-center", children: [_jsx("button", { className: "lf-cmd-btn analyze", disabled: isBuilding, onClick: () => onRunAction('ANALYZE'), children: "ANALYZE" }), _jsx("button", { className: "lf-cmd-btn synth", disabled: isBuilding, onClick: () => onRunAction('SYNTHESIZE'), children: "SYNTHESIZE" }), _jsx("button", { className: "lf-cmd-btn sim", disabled: isBuilding, onClick: () => onRunAction('SIMULATE'), children: "SIMULATE" }), _jsxs("div", { className: "lf-status-badge", children: [_jsx("span", { className: "lf-status-dot", style: { backgroundColor: statusColor } }), _jsx("span", { className: "lf-status-text", children: statusText })] })] })] }));
};
//# sourceMappingURL=NavigationHeader.js.map