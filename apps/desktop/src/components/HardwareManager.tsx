import React, { useState } from 'react';

export const HardwareManager: React.FC = () => {
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [terminalLog, setTerminalLog] = useState<string[]>(
    ['[UART Console Opened @ 115200 8N1]', 'System Boot: LogicForge iCE40 Core Ready', 'TX: 0x55 AA']
  );
  const [sendText, setSendText] = useState<string>('');

  const handleSend = () => {
    if (!sendText.trim()) return;
    setTerminalLog((prev) => [...prev, `TX > ${sendText}`]);
    setSendText('');
  };

  return (
    <div className="lf-hardware-workspace">
      <div className="lf-hardware-sidebar">
        <div className="lf-panel-header">
          <span className="lf-panel-title">CONNECTED HARDWARE</span>
        </div>
        <div className="lf-hw-list">
          <div className="lf-hw-card connected">
            <div className="lf-hw-icon">🔌</div>
            <div className="lf-hw-info">
              <span className="hw-name">Lattice iCEstick Dev Board</span>
              <span className="hw-sub">USB/JTAG | FTDI FT2232H</span>
              <span className="hw-status">● Connected</span>
            </div>
          </div>
        </div>

        <div className="lf-hw-actions">
          <button className="lf-btn program">Program Bitstream</button>
          <button className="lf-btn reset">Reset Target</button>
        </div>
      </div>

      <div className="lf-uart-terminal">
        <div className="lf-panel-header">
          <span className="lf-panel-title">INTEGRATED UART TERMINAL</span>
          <div className="lf-uart-settings">
            <label>Baud Rate: </label>
            <select value={baudRate} onChange={(e) => setBaudRate(parseInt(e.target.value, 10))}>
              <option value="9600">9600</option>
              <option value="115200">115200</option>
              <option value="230400">230400</option>
            </select>
          </div>
        </div>

        <div className="lf-terminal-console">
          {terminalLog.map((line, i) => (
            <div key={i} className="lf-terminal-line">
              {line}
            </div>
          ))}
        </div>

        <div className="lf-terminal-input">
          <input
            type="text"
            placeholder="Send ASCII / Hex bytes..."
            value={sendText}
            onChange={(e) => setSendText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

