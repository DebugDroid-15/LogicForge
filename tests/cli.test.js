import assert from 'node:assert';
import test from 'node:test';
import { runCLI } from '../apps/cli/dist/index.js';

test('LogicForge CLI executes tools discovery cleanly', async () => {
  await runCLI(['tools']);
});

