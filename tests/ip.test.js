import assert from 'node:assert';
import test from 'node:test';
import { IPService } from '../packages/core/dist/index.js';

test('IPService catalogues available IP cores and generates parameterized Verilog', () => {
  const catalog = IPService.getCatalog();
  assert.strictEqual(catalog.length >= 3, true);
  
  const fifoSpec = catalog.find(ip => ip.id === 'fifo_sync');
  assert.ok(fifoSpec, 'Expected fifo_sync IP core in catalog');

  const generatedFifo = IPService.generateIP({
    ipId: 'fifo_sync',
    instanceName: 'u_fifo',
    parameters: { DATA_WIDTH: 16, DEPTH: 64 }
  });

  assert.ok(generatedFifo.includes('module fifo_sync'), 'Module header generated');
  assert.ok(generatedFifo.includes('parameter DATA_WIDTH = 16'), 'DATA_WIDTH parameter substituted');
  assert.ok(generatedFifo.includes('parameter DEPTH = 64'), 'DEPTH parameter substituted');

  const generatedPwm = IPService.generateIP({
    ipId: 'pwm_generator',
    instanceName: 'u_pwm',
    parameters: { PWM_BITS: 12 }
  });

  assert.ok(generatedPwm.includes('module pwm_generator'), 'PWM generator module generated');
});
