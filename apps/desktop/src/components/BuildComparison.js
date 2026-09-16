import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const BuildComparison = () => {
    const compData = [
        { metric: 'LUTs (4-input)', buildA: '4210 (78%)', buildB: '4388 (81%)', delta: '+178 (+3.8%)', status: 'WARN' },
        { metric: 'Flip-Flops', buildA: '3021 (61%)', buildB: '3182 (64%)', delta: '+161 (+3.2%)', status: 'NEUTRAL' },
        { metric: 'Block RAM (4K)', buildA: '8 (32%)', buildB: '8 (32%)', delta: '0 (0.0%)', status: 'OK' },
        { metric: 'DSP Blocks', buildA: '4 (41%)', buildB: '4 (41%)', delta: '0 (0.0%)', status: 'OK' },
        { metric: 'Worst Setup Slack', buildA: '+0.41 ns', buildB: '-0.12 ns', delta: '-0.53 ns', status: 'FAIL' },
        { metric: 'Bitstream Size', buildA: '135 KB', buildB: '135 KB', delta: '0 KB', status: 'OK' },
    ];
    return (_jsxs("div", { className: "lf-build-comp", children: [_jsx("div", { className: "lf-panel-header", children: _jsx("span", { className: "lf-panel-title", children: "BUILD REVISION COMPARISON \u2014 [BUILD #104 vs BUILD #105]" }) }), _jsxs("table", { className: "lf-comp-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "METRIC" }), _jsx("th", { children: "REVISION A (MAIN)" }), _jsx("th", { children: "REVISION B (CURRENT)" }), _jsx("th", { children: "DELTA" })] }) }), _jsx("tbody", { children: compData.map((row, idx) => (_jsxs("tr", { children: [_jsx("td", { className: "metric-name", children: row.metric }), _jsx("td", { children: row.buildA }), _jsx("td", { children: row.buildB }), _jsx("td", { className: `delta ${row.status.toLowerCase()}`, children: row.delta })] }, idx))) })] })] }));
};
//# sourceMappingURL=BuildComparison.js.map