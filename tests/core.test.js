import assert from 'node:assert';
import test from 'node:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectManager, DAGBuildEngine } from '../packages/core/dist/index.js';

test('ProjectManager creates and loads project manifest', () => {
  const tmpDir = path.join(process.cwd(), 'build_test_tmp');
  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });

  const { manifestPath, manifest } = ProjectManager.createProject(tmpDir, {
    name: 'test_project',
    template: 'blink',
  });

  assert.strictEqual(fs.existsSync(manifestPath), true);
  assert.strictEqual(manifest.name, 'test_project');
  assert.strictEqual(manifest.topModule, 'top');

  const loaded = ProjectManager.loadProject(tmpDir);
  assert.strictEqual(loaded.name, 'test_project');

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('DAGBuildEngine builds correct execution plan', () => {
  const dag = new DAGBuildEngine();
  const plan = dag.getExecutionPlan('BITSTREAM');

  assert.deepStrictEqual(plan, ['PARSE', 'ELABORATION', 'SYNTHESIS', 'PLACE', 'ROUTE', 'BITSTREAM']);
});
