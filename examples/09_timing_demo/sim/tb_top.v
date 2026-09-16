`timescale 1ns/1ps
module tb_top;
    reg clk = 0;
    reg [31:0] a = 32'h00000005;
    reg [31:0] b = 32'h0000000A;
    wire [31:0] sum;

    top uut (
        .clk(clk),
        .a(a),
        .b(b),
        .sum(sum)
    );

    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/waveform.vcd");
        $dumpvars(0, tb_top);
        #100;
        $finish;
    end
endmodule

