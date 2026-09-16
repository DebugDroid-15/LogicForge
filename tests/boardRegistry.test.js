import assert from 'node:assert';
import test from 'node:test';
import { BoardRegistry } from '../packages/core/dist/index.js';

test('BoardRegistry loads builtin and external board definitions', () => {
  const registry = BoardRegistry.getInstance();
  const boards = registry.listBoards();
  assert.strictEqual(boards.length >= 2, true);

  const icestick = registry.getBoard('icestick');
  assert.notStrictEqual(icestick, undefined);
  assert.strictEqual(icestick?.fpga.family, 'iCE40');
  assert.strictEqual(icestick?.clockMHz, 12);
});

