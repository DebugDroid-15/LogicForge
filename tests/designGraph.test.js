import assert from 'node:assert';
import test from 'node:test';
import { DesignGraphService } from '../packages/core/dist/index.js';

test('DesignGraphService builds hierarchy from Verilog source', () => {
  const sources = [{
    path: 'top.v',
    content: `
module top(input clk, output led);
  counter u_count(.clk(clk));
endmodule

module counter(input clk);
endmodule
`
  }];

  const graph = DesignGraphService.buildGraph(sources);
  assert.strictEqual(graph.topModule, 'counter');
  assert.ok(graph.nodes['counter']);
});

