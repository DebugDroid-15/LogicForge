import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const PinPlanner = () => {
    const [pins, setPins] = useState({
        clk: { port: 'clk', pin: '21', ioStandard: 'LVCMOS33', bank: 1 },
        rst: { port: 'rst', pin: '22', ioStandard: 'LVCMOS33', bank: 1 },
        led: { port: 'led', pin: '99', ioStandard: 'LVCMOS33', bank: 2 },
        uart_tx: { port: 'uart_tx', pin: '102', ioStandard: 'LVCMOS33', bank: 2 },
    });
    const handlePinChange = (port, field, val) => {
        setPins((prev) => ({
            ...prev,
            [port]: { ...prev[port], [field]: val },
        }));
    };
    return (_jsxs("div", { className: "lf-pin-planner", children: [_jsx("div", { className: "lf-panel-header", children: _jsx("span", { className: "lf-panel-title", children: "FPGA PIN PLANNER & CONSTRAINT MATRIX" }) }), _jsxs("table", { className: "lf-pin-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "HDL PORT" }), _jsx("th", { children: "PACKAGE PIN" }), _jsx("th", { children: "I/O STANDARD" }), _jsx("th", { children: "BANK" }), _jsx("th", { children: "DRIVE (mA)" }), _jsx("th", { children: "PULLUP" })] }) }), _jsx("tbody", { children: Object.entries(pins).map(([port, pin]) => (_jsxs("tr", { children: [_jsx("td", { className: "port-name", children: port }), _jsx("td", { children: _jsx("input", { type: "text", className: "lf-pin-input", value: pin.pin, onChange: (e) => handlePinChange(port, 'pin', e.target.value) }) }), _jsx("td", { children: _jsxs("select", { className: "lf-pin-select", value: pin.ioStandard, onChange: (e) => handlePinChange(port, 'ioStandard', e.target.value), children: [_jsx("option", { value: "LVCMOS33", children: "LVCMOS33 (3.3V)" }), _jsx("option", { value: "LVCMOS25", children: "LVCMOS25 (2.5V)" }), _jsx("option", { value: "LVCMOS18", children: "LVCMOS18 (1.8V)" })] }) }), _jsxs("td", { children: ["Bank ", pin.bank || 1] }), _jsx("td", { children: "8 mA" }), _jsx("td", { children: _jsx("input", { type: "checkbox", checked: pin.pullup || false, onChange: (e) => handlePinChange(port, 'pullup', e.target.checked) }) })] }, port))) })] })] }));
};
//# sourceMappingURL=PinPlanner.js.map