import assert from 'node:assert';
import test from 'node:test';
import { LogParser } from '../packages/toolchain/dist/index.js';

test('LogParser parses Verilog/GCC errors and Yosys output', () => {
  const sampleLog = `
top.v:14: error: undeclared signal 'counter_en'
ERROR: Undeclared signal counter_en in module top.
Warning: Inferred latch for signal 'led'
`;

  const diags = LogParser.parseDiagnostics('iverilog', 'SIMULATE', sampleLog);
  assert.strictEqual(diags.length, 3);
  assert.strictEqual(diags[0].file, 'top.v');
  assert.strictEqual(diags[0].line, 14);
  assert.strictEqual(diags[0].severity, 'ERROR');
  assert.strictEqual(diags[2].severity, 'WARNING');
});

