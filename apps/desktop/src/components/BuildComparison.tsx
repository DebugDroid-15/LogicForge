import React from 'react';

export const BuildComparison: React.FC = () => {
  const compData = [
    { metric: 'LUTs (4-input)', buildA: '4210 (78%)', buildB: '4388 (81%)', delta: '+178 (+3.8%)', status: 'WARN' },
    { metric: 'Flip-Flops', buildA: '3021 (61%)', buildB: '3182 (64%)', delta: '+161 (+3.2%)', status: 'NEUTRAL' },
    { metric: 'Block RAM (4K)', buildA: '8 (32%)', buildB: '8 (32%)', delta: '0 (0.0%)', status: 'OK' },
    { metric: 'DSP Blocks', buildA: '4 (41%)', buildB: '4 (41%)', delta: '0 (0.0%)', status: 'OK' },
    { metric: 'Worst Setup Slack', buildA: '+0.41 ns', buildB: '-0.12 ns', delta: '-0.53 ns', status: 'FAIL' },
    { metric: 'Bitstream Size', buildA: '135 KB', buildB: '135 KB', delta: '0 KB', status: 'OK' },
  ];

  return (
    <div className="lf-build-comp">
      <div className="lf-panel-header">
        <span className="lf-panel-title">BUILD REVISION COMPARISON — [BUILD #104 vs BUILD #105]</span>
      </div>

      <table className="lf-comp-table">
        <thead>
          <tr>
            <th>METRIC</th>
            <th>REVISION A (MAIN)</th>
            <th>REVISION B (CURRENT)</th>
            <th>DELTA</th>
          </tr>
        </thead>
        <tbody>
          {compData.map((row, idx) => (
            <tr key={idx}>
              <td className="metric-name">{row.metric}</td>
              <td>{row.buildA}</td>
              <td>{row.buildB}</td>
              <td className={`delta ${row.status.toLowerCase()}`}>{row.delta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

