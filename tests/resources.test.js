import assert from 'node:assert';
import test from 'node:test';
import { ResourceAnalysisService, ResourceTrendingService } from '../packages/core/dist/index.js';

test('ResourceAnalysisService parses primitive cell counts', () => {
  const log = `
SB_LUT4 42
SB_DFF 50
SB_RAM 4
`;
  const res = ResourceAnalysisService.parseYosysReport(log);
  assert.strictEqual(res.luts.used, 42);
  assert.strictEqual(res.flipFlops.used, 50);
  assert.strictEqual(res.bram.used, 4);

  ResourceTrendingService.addBuildRecord({
    buildId: 'b1',
    timestamp: '2026-09-16T00:00:00Z',
    device: 'iCE40HX1K-TQ144',
    lutsUsed: 40,
    ffsUsed: 50,
    bramsUsed: 2,
    timingSlackNs: 1.2,
    bitstreamSizeBytes: 32000
  });

  ResourceTrendingService.addBuildRecord({
    buildId: 'b2',
    timestamp: '2026-09-16T01:00:00Z',
    device: 'iCE40HX1K-TQ144',
    lutsUsed: 45,
    ffsUsed: 52,
    bramsUsed: 2,
    timingSlackNs: 0.8,
    bitstreamSizeBytes: 32000
  });

  const diff = ResourceTrendingService.compareBuilds('b1', 'b2');
  assert.strictEqual(diff.lutDelta, 5);
  assert.strictEqual(diff.ffDelta, 2);
});
