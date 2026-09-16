// LogicForge Timing Demo: Deep Carry Chain Adder (Demonstrating Timing Slack Analysis)
module top (
    input wire clk,
    input wire [31:0] a,
    input wire [31:0] b,
    output reg [31:0] sum
);
    reg [31:0] pipe_a, pipe_b;

    always @(posedge clk) begin
        pipe_a <= a;
        pipe_b <= b;
        sum <= pipe_a + pipe_b;
    end
endmodule

