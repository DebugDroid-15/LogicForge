import assert from 'node:assert';
import test from 'node:test';
import { BlockDesignService } from '../packages/core/dist/index.js';

test('BlockDesignService validates schematic topologies and generates Verilog wrappers', () => {
  const validDesign = {
    id: 'top_bd',
    name: 'TopBlockDesign',
    blocks: [
      { id: 'b1', name: 'counter_inst', moduleName: 'counter', ports: [{ name: 'out', direction: 'output', width: 8 }] },
      { id: 'b2', name: 'display_inst', moduleName: 'display', ports: [{ name: 'in', direction: 'input', width: 8 }] }
    ],
    connections: [
      { fromBlock: 'b1', fromPort: 'out', toBlock: 'b2', toPort: 'in' }
    ]
  };

  const validationValid = BlockDesignService.validateDesign(validDesign);
  assert.strictEqual(validationValid.valid, true);

  const wrapperCode = BlockDesignService.generateWrapper(validDesign);
  assert.ok(wrapperCode.includes('module TopBlockDesign'), 'Wrapper module declaration generated');
  assert.ok(wrapperCode.includes('counter counter_inst'), 'Block 1 instantiated');
  assert.ok(wrapperCode.includes('display display_inst'), 'Block 2 instantiated');

  const invalidDesign = {
    id: 'bad_bd',
    name: 'BadBlockDesign',
    blocks: [
      { id: 'b1', name: 'counter_inst', moduleName: 'counter', ports: [{ name: 'out', direction: 'output', width: 8 }] },
      { id: 'b2', name: 'display_inst', moduleName: 'display', ports: [{ name: 'in', direction: 'input', width: 4 }] }
    ],
    connections: [
      { fromBlock: 'b1', fromPort: 'out', toBlock: 'b2', toPort: 'in' }
    ]
  };

  const validationInvalid = BlockDesignService.validateDesign(invalidDesign);
  assert.strictEqual(validationInvalid.valid, false);
  assert.strictEqual(validationInvalid.errors.length, 1);
  assert.ok(validationInvalid.errors[0].includes('Width mismatch'), 'Width mismatch error recorded');
});

