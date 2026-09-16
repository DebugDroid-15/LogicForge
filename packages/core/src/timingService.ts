import { TimingSummary, TimingPath, ClockConstraint } from './types.js';

export interface TimingViolation {
  clockName: string;
  slackNs: number;
  requiredNs: number;
  actualNs: number;
  criticalPath: TimingPath;
  description: string;
}

export class TimingService {
  public static evaluateTiming(summary: TimingSummary): {
    passed: boolean;
    slackNs: number;
    violations: TimingViolation[];
    statusText: string;
  } {
    const passed = summary.slackNs >= 0;
    const violations: TimingViolation[] = [];

    if (!passed && summary.worstPaths.length > 0) {
      violations.push({
        clockName: summary.clockName,
        slackNs: summary.slackNs,
        requiredNs: summary.requiredNs,
        actualNs: summary.actualNs,
        criticalPath: summary.worstPaths[0],
        description: `Setup timing violation of ${Math.abs(summary.slackNs)}ns on clock '${summary.clockName}' (Required: ${summary.requiredNs}ns, Actual: ${summary.actualNs}ns).`,
      });
    }

    return {
      passed,
      slackNs: summary.slackNs,
      violations,
      statusText: passed ? `✓ Timing Met (${summary.slackNs}ns slack)` : `✗ Timing Failed (${summary.slackNs}ns slack)`,
    };
  }

  public static generateClockReport(clocks: ClockConstraint[], summary?: TimingSummary): string {
    const lines = ['# LogicForge Timing & Clock Summary Report', ''];

    lines.push('| Clock Name | Target Freq | Required Period | Actual Period | Slack | Status |');
    lines.push('| :--- | :---: | :---: | :---: | :---: | :---: |');

    for (const clk of clocks) {
      const isMatched = summary && summary.clockName === clk.name;
      const actual = isMatched ? `${summary.actualNs} ns` : `${clk.periodNs} ns`;
      const slack = isMatched ? `${summary.slackNs} ns` : '0.00 ns';
      const status = isMatched ? (summary.slackNs >= 0 ? '✓ PASS' : '✗ FAIL') : '✓ PASS';
      const freq = (1000 / clk.periodNs).toFixed(1);

      lines.push(`| ${clk.name} | ${freq} MHz | ${clk.periodNs.toFixed(2)} ns | ${actual} | ${slack} | ${status} |`);
    }

    return lines.join('\n');
  }
}

