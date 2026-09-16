`timescale 1ns/1ps
module tb_top;
    reg clk = 0;
    reg rst = 1;
    wire [7:0] count;

    top uut (
        .clk(clk),
        .rst(rst),
        .count(count)
    );

    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/waveform.vcd");
        $dumpvars(0, tb_top);
        #20 rst = 0;
        #200;
        $finish;
    end
endmodule

