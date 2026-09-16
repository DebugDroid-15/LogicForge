// Golden Example 01: Blink LED
module top (
    input wire clk,
    output reg led
);
    reg [23:0] counter = 24'd0;

    always @(posedge clk) begin
        counter <= counter + 1'b1;
        if (counter == 24'd12_000_000) begin
            counter <= 24'd0;
            led <= ~led;
        end
    end
endmodule

