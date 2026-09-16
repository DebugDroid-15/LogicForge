import assert from 'node:assert';
import test from 'node:test';
import { TimingService } from '../packages/core/dist/index.js';

test('TimingService evaluates timing pass and violation states correctly', () => {
  const passSummary = {
    clockName: 'clk',
    requiredNs: 10.0,
    actualNs: 9.43,
    slackNs: 0.57,
    worstPaths: [],
  };

  const evalPass = TimingService.evaluateTiming(passSummary);
  assert.strictEqual(evalPass.passed, true);
  assert.strictEqual(evalPass.violations.length, 0);

  const failSummary = {
    clockName: 'clk',
    requiredNs: 10.0,
    actualNs: 11.2,
    slackNs: -1.2,
    worstPaths: [
      {
        source: 'reg_a',
        destination: 'reg_b',
        slackNs: -1.2,
        requiredNs: 10.0,
        actualNs: 11.2,
        logicDepth: 5,
        elements: [],
      },
    ],
  };

  const evalFail = TimingService.evaluateTiming(failSummary);
  assert.strictEqual(evalFail.passed, false);
  assert.strictEqual(evalFail.violations.length, 1);
  assert.strictEqual(evalFail.violations[0].slackNs, -1.2);
});
