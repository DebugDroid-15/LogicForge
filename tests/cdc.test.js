import assert from 'node:assert';
import test from 'node:test';
import { CDCService, ResetService } from '../packages/core/dist/index.js';

test('CDCService and ResetService detect domain issues', () => {
  const cdcCode = `
always @(posedge clk_b) begin
  reg_b <= signal_a;
end
`;
  const cdcDiags = CDCService.analyzeCDC('top.v', cdcCode);
  assert.strictEqual(cdcDiags.length, 1);
  assert.strictEqual(cdcDiags[0].id, 'LF-CDC-001');

  const resetCode = `
always @(posedge clk or posedge rst) begin
  if (rst) reg_a <= 0;
end
`;
  const resetDiags = ResetService.analyzeResets('top.v', resetCode);
  assert.strictEqual(resetDiags.length, 1);
  assert.strictEqual(resetDiags[0].id, 'RESET-001');
});

