import assert from 'node:assert';
import test from 'node:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectManager } from '../packages/core/dist/index.js';
import { YosysBackend, NextpnrBackend, IcepackBackend } from '../packages/backends/dist/index.js';

test('Full FPGA Build Pipeline generates BitstreamArtifact', async () => {
  const projectDir = path.join(process.cwd(), 'examples/01_blink_led');
  const manifest = ProjectManager.loadProject(projectDir);

  const synthRes = await YosysBackend.synthesize(projectDir, manifest);
  assert.strictEqual(synthRes.result.status, 'SUCCESS');

  const pnrRes = await NextpnrBackend.placeAndRoute(projectDir, manifest);
  assert.strictEqual(pnrRes.result.status, 'SUCCESS');

  const bitRes = await IcepackBackend.generateBitstream(projectDir, manifest);
  assert.strictEqual(bitRes.result.status, 'SUCCESS');
  assert.notStrictEqual(bitRes.artifact, undefined);
  assert.strictEqual(bitRes.artifact?.format, 'BIN');
  assert.strictEqual(fs.existsSync(path.join(projectDir, bitRes.artifact?.path || '')), true);
});
