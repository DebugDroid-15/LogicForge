`timescale 1ns/1ps
module tb_top;
    reg clk = 0;
    wire led;

    top uut (
        .clk(clk),
        .led(led)
    );

    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/waveform.vcd");
        $dumpvars(0, tb_top);
        #500;
        $finish;
    end
endmodule

