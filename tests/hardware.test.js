import assert from 'node:assert';
import test from 'node:test';
import { HardwareService, SerialBackend } from '../packages/core/dist/index.js';

test('HardwareService enumerates board devices and transitions states', async () => {
  const hw = HardwareService.getInstance();
  const devices = await hw.enumerate();

  assert.strictEqual(devices.length, 1);
  assert.strictEqual(devices[0].boardId, 'icestick');
  assert.strictEqual(hw.getState(), 'Detected');

  const connected = await hw.connect('icestick');
  assert.strictEqual(connected, true);
  assert.strictEqual(hw.getState(), 'Connected');
});

test('SerialBackend manages UART communication logging', () => {
  const serial = new SerialBackend();
  const ports = serial.enumeratePorts();
  assert.strictEqual(ports.length > 0, true);

  serial.open({ port: 'COM7', baudRate: 115200 });
  assert.strictEqual(serial.getIsConnected(), true);

  serial.write('TX: TEST_BYTES');
  const log = serial.getLog();
  assert.strictEqual(log.length, 2);
  assert.strictEqual(log[1].data, 'TX: TEST_BYTES');

  serial.close();
  assert.strictEqual(serial.getIsConnected(), false);
});

