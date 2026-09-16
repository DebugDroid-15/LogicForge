import assert from 'node:assert';
import test from 'node:test';
import { FSMService } from '../packages/core/dist/index.js';

test('FSMService extracts state machine states and transitions', () => {
  const code = `
module fsm_demo(input clk);
  parameter IDLE = 2'b00;
  parameter BUSY = 2'b01;
  reg [1:0] state;

  always @(posedge clk) begin
    case (state)
      IDLE: state <= BUSY;
      BUSY: state <= IDLE;
    endcase
  end
endmodule
`;

  const fsms = FSMService.extractFSM('fsm_demo.v', code);
  assert.strictEqual(fsms.length, 1);
  assert.strictEqual(fsms[0].states.length, 2);
  assert.strictEqual(fsms[0].states[0].name, 'IDLE');
});

