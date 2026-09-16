import assert from 'node:assert';
import test from 'node:test';
import { VCDParser } from '../packages/waveform/dist/index.js';

test('VCDParser parses VCD waveforms correctly', () => {
  const vcd = `
$date Tue Sep 15 22:00:00 2026 $end
$version Icarus Verilog $end
$timescale 1ns $end
$scope module tb_top $end
$var wire 1 ! clk $end
$upscope $end
$enddefinitions $end
#0
$dumpvars
0!
$end
#10
1!
#20
0!
`;

  const parsed = VCDParser.parse(vcd);
  assert.strictEqual(parsed.timescale, '1ns');
  assert.strictEqual(parsed.maxTime, 20);

  const sig = parsed.signals['tb_top.clk'];
  assert.notStrictEqual(sig, undefined);
  assert.strictEqual(sig.changes.length, 3);
  assert.strictEqual(sig.changes[0].value, '0');
  assert.strictEqual(sig.changes[1].value, '1');
});

