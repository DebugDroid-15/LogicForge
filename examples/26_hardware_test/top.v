module hardware_test_top (
    input wire clk,
    output reg [3:0] count
);

    always @(posedge clk) begin
        count <= count + 1'b1;
    end

endmodule
