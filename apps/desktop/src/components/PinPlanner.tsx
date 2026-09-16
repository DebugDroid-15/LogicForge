import React, { useState } from 'react';
import { PinConstraint } from '@logicforge/constraints';

export const PinPlanner: React.FC = () => {
  const [pins, setPins] = useState<Record<string, PinConstraint>>({
    clk: { port: 'clk', pin: '21', ioStandard: 'LVCMOS33', bank: 1 },
    rst: { port: 'rst', pin: '22', ioStandard: 'LVCMOS33', bank: 1 },
    led: { port: 'led', pin: '99', ioStandard: 'LVCMOS33', bank: 2 },
    uart_tx: { port: 'uart_tx', pin: '102', ioStandard: 'LVCMOS33', bank: 2 },
  });

  const handlePinChange = (port: string, field: keyof PinConstraint, val: any) => {
    setPins((prev) => ({
      ...prev,
      [port]: { ...prev[port], [field]: val },
    }));
  };

  return (
    <div className="lf-pin-planner">
      <div className="lf-panel-header">
        <span className="lf-panel-title">FPGA PIN PLANNER & CONSTRAINT MATRIX</span>
      </div>

      <table className="lf-pin-table">
        <thead>
          <tr>
            <th>HDL PORT</th>
            <th>PACKAGE PIN</th>
            <th>I/O STANDARD</th>
            <th>BANK</th>
            <th>DRIVE (mA)</th>
            <th>PULLUP</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(pins).map(([port, pin]) => (
            <tr key={port}>
              <td className="port-name">{port}</td>
              <td>
                <input
                  type="text"
                  className="lf-pin-input"
                  value={pin.pin}
                  onChange={(e) => handlePinChange(port, 'pin', e.target.value)}
                />
              </td>
              <td>
                <select
                  className="lf-pin-select"
                  value={pin.ioStandard}
                  onChange={(e) => handlePinChange(port, 'ioStandard', e.target.value)}
                >
                  <option value="LVCMOS33">LVCMOS33 (3.3V)</option>
                  <option value="LVCMOS25">LVCMOS25 (2.5V)</option>
                  <option value="LVCMOS18">LVCMOS18 (1.8V)</option>
                </select>
              </td>
              <td>Bank {pin.bank || 1}</td>
              <td>8 mA</td>
              <td>
                <input
                  type="checkbox"
                  checked={pin.pullup || false}
                  onChange={(e) => handlePinChange(port, 'pullup', e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

