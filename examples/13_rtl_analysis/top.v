module top (
    input wire clk_a,
    input wire clk_b,
    input wire rst,
    input wire data_in,
    output wire data_out
);

    wire [7:0] count;
    reg signal_a;
    reg signal_b;

    always @(posedge clk_a) begin
        signal_a <= data_in;
    end

    // Unsynchronized Clock Domain Crossing (CDC)
    always @(posedge clk_b) begin
        signal_b <= signal_a;
    end

    assign data_out = signal_b;

endmodule

