import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { VCDParser } from '@logicforge/waveform';
export const WaveformViewer = ({ vcdData: initialData, vcdContent }) => {
    const [data, setData] = useState(initialData);
    const [zoom, setZoom] = useState(1.0);
    const [selectedRadix, setSelectedRadix] = useState('HEX');
    const [cursorTime, setCursorTime] = useState(50);
    const canvasRef = useRef(null);
    useEffect(() => {
        if (vcdContent) {
            const parsed = VCDParser.parse(vcdContent);
            setData(parsed);
        }
    }, [vcdContent]);
    useEffect(() => {
        if (!data || !canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const signals = Object.values(data.signals);
        const rowHeight = 36;
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        // Dark technical background
        ctx.fillStyle = '#0f141c';
        ctx.fillRect(0, 0, width, height);
        // Draw Grid Lines & Timestamps
        ctx.strokeStyle = '#1e2836';
        ctx.lineWidth = 1;
        const maxTime = Math.max(100, data.maxTime);
        const step = 50 * zoom;
        for (let x = 120; x < width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            const timeVal = Math.round(((x - 120) / step) * 20);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px monospace';
            ctx.fillText(`${timeVal} ${data.timescale}`, x + 4, 14);
        }
        // Draw Signals
        signals.forEach((sig, idx) => {
            const yBase = 40 + idx * rowHeight;
            // Label background
            ctx.fillStyle = '#161f2e';
            ctx.fillRect(0, yBase - 14, 115, rowHeight - 4);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '12px monospace';
            ctx.fillText(sig.name.split('.').pop() || sig.name, 8, yBase + 6);
            // Draw digital trace
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 2;
            ctx.beginPath();
            let currentY = yBase + 12;
            ctx.moveTo(120, currentY);
            if (sig.changes.length === 0) {
                ctx.lineTo(width, currentY);
            }
            else {
                sig.changes.forEach((ch) => {
                    const x = 120 + (ch.time / maxTime) * (width - 140) * zoom;
                    const nextY = ch.value === '1' ? yBase - 8 : yBase + 12;
                    ctx.lineTo(x, currentY);
                    ctx.lineTo(x, nextY);
                    currentY = nextY;
                });
                ctx.lineTo(width, currentY);
            }
            ctx.stroke();
        });
        // Draw Cursor
        if (cursorTime !== null) {
            const cursorX = 120 + (cursorTime / maxTime) * (width - 140) * zoom;
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(cursorX, 0);
            ctx.lineTo(cursorX, height);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#f43f5e';
            ctx.fillText(`T = ${cursorTime} ${data.timescale}`, cursorX + 6, height - 10);
        }
    }, [data, zoom, selectedRadix, cursorTime]);
    return (_jsxs("div", { className: "lf-waveform-panel", children: [_jsxs("div", { className: "lf-waveform-toolbar", children: [_jsx("span", { className: "lf-panel-title", children: "DIGITAL WAVEFORM VIEWER" }), _jsxs("div", { className: "lf-toolbar-actions", children: [_jsx("label", { children: "Radix: " }), _jsxs("select", { value: selectedRadix, onChange: (e) => setSelectedRadix(e.target.value), children: [_jsx("option", { value: "HEX", children: "HEX" }), _jsx("option", { value: "BIN", children: "BIN" }), _jsx("option", { value: "DEC", children: "DEC" })] }), _jsx("button", { onClick: () => setZoom((z) => Math.min(3.0, z + 0.2)), children: "Zoom +" }), _jsx("button", { onClick: () => setZoom((z) => Math.max(0.5, z - 0.2)), children: "Zoom -" }), _jsx("button", { onClick: () => setZoom(1.0), children: "Reset" })] })] }), _jsx("div", { className: "lf-waveform-canvas-container", children: _jsx("canvas", { ref: canvasRef, width: 900, height: 320, onClick: (e) => {
                        const rect = canvasRef.current?.getBoundingClientRect();
                        if (rect && data) {
                            const clickX = e.clientX - rect.left - 120;
                            const time = Math.max(0, Math.round((clickX / (900 - 140)) * data.maxTime));
                            setCursorTime(time);
                        }
                    } }) })] }));
};
//# sourceMappingURL=WaveformViewer.js.map