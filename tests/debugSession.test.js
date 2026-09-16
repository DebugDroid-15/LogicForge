import assert from 'node:assert';
import test from 'node:test';
import { DebugService, BackendRegistry, DeviceSearchService, HardwareTestService } from '../packages/core/dist/index.js';

test('DebugService creates debug sessions and returns probe capabilities', () => {
  const caps = DebugService.getProbeCapabilities();
  assert.strictEqual(caps.connected, false);
  assert.strictEqual(caps.capabilities.programming, true);

  const session = DebugService.createSession('iCE40HX1K-TQ144');
  assert.strictEqual(session.status, 'Connected');

  const capture = DebugService.executeCapture(['clk', 'data']);
  assert.strictEqual(capture.status, 'MOCK');
  assert.strictEqual(capture.signals.length, 2);
});

test('BackendRegistry exposes machine-readable capability matrix including Gowin', () => {
  const matrix = BackendRegistry.getCapabilities();
  assert.strictEqual(matrix.length >= 3, true);

  const gowin = matrix.find(b => b.family === 'GW1N');
  assert.ok(gowin, 'Expected GW1N Gowin backend entry');
  assert.strictEqual(gowin.synthesis, true);
  assert.strictEqual(gowin.placeAndRoute, false);
});

test('DeviceSearchService searches FPGA parts', () => {
  const results = DeviceSearchService.search('iCE40');
  assert.strictEqual(results.length >= 2, true);

  const device = DeviceSearchService.getDevice('iCE40HX1K-TQ144');
  assert.ok(device);
  assert.strictEqual(device.lutCount, 1280);
});

test('HardwareTestService reports hardware test execution status', () => {
  const report = HardwareTestService.runTest({
    name: 'smoke_test',
    bitstreamPath: 'hardware.bin',
    timeoutMs: 1000
  });
  assert.strictEqual(report.status, 'HARDWARE_UNAVAILABLE');
  assert.ok(report.details.includes('not connected'));
});
