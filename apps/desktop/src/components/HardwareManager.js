import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export const HardwareManager = () => {
    const [baudRate, setBaudRate] = useState(115200);
    const [terminalLog, setTerminalLog] = useState(['[UART Console Opened @ 115200 8N1]', 'System Boot: LogicForge iCE40 Core Ready', 'TX: 0x55 AA']);
    const [sendText, setSendText] = useState('');
    const handleSend = () => {
        if (!sendText.trim())
            return;
        setTerminalLog((prev) => [...prev, `TX > ${sendText}`]);
        setSendText('');
    };
    return (_jsxs("div", { className: "lf-hardware-workspace", children: [_jsxs("div", { className: "lf-hardware-sidebar", children: [_jsx("div", { className: "lf-panel-header", children: _jsx("span", { className: "lf-panel-title", children: "CONNECTED HARDWARE" }) }), _jsx("div", { className: "lf-hw-list", children: _jsxs("div", { className: "lf-hw-card connected", children: [_jsx("div", { className: "lf-hw-icon", children: "\uD83D\uDD0C" }), _jsxs("div", { className: "lf-hw-info", children: [_jsx("span", { className: "hw-name", children: "Lattice iCEstick Dev Board" }), _jsx("span", { className: "hw-sub", children: "USB/JTAG | FTDI FT2232H" }), _jsx("span", { className: "hw-status", children: "\u25CF Connected" })] })] }) }), _jsxs("div", { className: "lf-hw-actions", children: [_jsx("button", { className: "lf-btn program", children: "Program Bitstream" }), _jsx("button", { className: "lf-btn reset", children: "Reset Target" })] })] }), _jsxs("div", { className: "lf-uart-terminal", children: [_jsxs("div", { className: "lf-panel-header", children: [_jsx("span", { className: "lf-panel-title", children: "INTEGRATED UART TERMINAL" }), _jsxs("div", { className: "lf-uart-settings", children: [_jsx("label", { children: "Baud Rate: " }), _jsxs("select", { value: baudRate, onChange: (e) => setBaudRate(parseInt(e.target.value, 10)), children: [_jsx("option", { value: "9600", children: "9600" }), _jsx("option", { value: "115200", children: "115200" }), _jsx("option", { value: "230400", children: "230400" })] })] })] }), _jsx("div", { className: "lf-terminal-console", children: terminalLog.map((line, i) => (_jsx("div", { className: "lf-terminal-line", children: line }, i))) }), _jsxs("div", { className: "lf-terminal-input", children: [_jsx("input", { type: "text", placeholder: "Send ASCII / Hex bytes...", value: sendText, onChange: (e) => setSendText(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSend() }), _jsx("button", { onClick: handleSend, children: "Send" })] })] })] }));
};
//# sourceMappingURL=HardwareManager.js.map