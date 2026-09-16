import assert from 'node:assert';
import test from 'node:test';
import { HDLLintService } from '../packages/core/dist/index.js';

test('HDLLintService identifies latch inference, width mismatch, and undriven wire issues', () => {
  const code = `
module test_module(
  input wire clk,
  input wire [7:0] data_in,
  output reg [3:0] data_out
);

  wire [7:0] temp_wire;

  always @(*) begin
    if (clk) begin
      data_out = data_in; // Width mismatch (4 bits = 8 bits)
    end
    // Missing else -> inferred latch
  end

endmodule
`;

  const results = HDLLintService.lintSource('test_module.v', code);

  assert.strictEqual(results.length > 0, true);
  
  const latchRule = results.find(r => r.id === 'LF-LINT-001');
  assert.ok(latchRule, 'Expected LF-LINT-001 latch inference warning');
  assert.strictEqual(latchRule.severity, 'WARNING');

  const widthRule = results.find(r => r.id === 'LF-LINT-002');
  assert.ok(widthRule, 'Expected LF-LINT-002 width mismatch warning');

  const undrivenRule = results.find(r => r.id === 'LF-LINT-004');
  assert.ok(undrivenRule, 'Expected LF-LINT-004 undriven wire warning for temp_wire');
});
