import assert from 'node:assert';
import test from 'node:test';
import { ProjectPackager } from '../packages/core/dist/index.js';

test('ProjectPackager creates lockfiles and reproducible SHA256 build fingerprints', () => {
  const project = {
    name: 'Blinky',
    target: { vendor: 'Lattice', family: 'iCE40', device: 'iCE40HX1K-TQ144', package: 'TQ144' },
    topModule: 'top',
    sources: ['top.v'],
    constraints: ['pins.pcf']
  };

  const lockfile = ProjectPackager.createLockfile(project, { 'yosys': '0.36', 'nextpnr-ice40': '0.7' });
  assert.strictEqual(lockfile.projectName, 'Blinky');
  assert.strictEqual(lockfile.toolchainVersions['yosys'], '0.36');
  assert.ok(lockfile.fingerprint, 'Fingerprint computed');

  const files = [
    { path: 'top.v', content: 'module top(input clk, output led); assign led = clk; endmodule' },
    { path: 'pins.pcf', content: 'set_io clk 21\nset_io led 99\n' }
  ];

  const fp1 = ProjectPackager.calculateFingerprint(project, files);
  const fp2 = ProjectPackager.calculateFingerprint(project, files);
  assert.strictEqual(fp1, fp2, 'Fingerprints are deterministic for identical contents');

  const modifiedFiles = [
    { path: 'top.v', content: 'module top(input clk, output led); assign led = ~clk; endmodule' },
    { path: 'pins.pcf', content: 'set_io clk 21\nset_io led 99\n' }
  ];
  const fp3 = ProjectPackager.calculateFingerprint(project, modifiedFiles);
  assert.notStrictEqual(fp1, fp3, 'Fingerprint changes when source content changes');
});

