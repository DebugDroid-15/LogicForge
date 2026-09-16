import assert from 'node:assert';
import test from 'node:test';
import { WorkspaceService, QuickFixService, PluginService, DebugArchitectureService } from '../packages/core/dist/index.js';

test('WorkspaceService returns default workspace layout', () => {
  const state = WorkspaceService.getDefaultState();
  assert.strictEqual(state.activeTab, 'DESIGN');
  assert.strictEqual(state.sidebarCollapsed, false);
});

test('QuickFixService generates quick fixes for diagnostics', () => {
  const diag = {
    id: 'LF-LINT-001',
    severity: 'WARNING',
    tool: 'LogicForge Lint',
    stage: 'LINT',
    message: 'Latch warning'
  };
  const fixes = QuickFixService.getFixes(diag);
  assert.strictEqual(fixes.length, 1);
  assert.strictEqual(fixes[0].replacementText, 'always @(*)');
});

test('PluginService lists registered plugins', () => {
  const plugins = PluginService.listPlugins();
  assert.strictEqual(plugins.length >= 1, true);
  assert.strictEqual(plugins[0].category, 'Backend');
});

test('DebugArchitectureService returns hardware debug probe status', () => {
  const probe = DebugArchitectureService.detectProbe();
  assert.strictEqual(probe.available, false);
  assert.ok(probe.reasonIfUnavailable);
});
