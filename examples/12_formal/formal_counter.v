module formal_counter (
    input wire clk,
    input wire rst,
    output reg [3:0] count
);

    always @(posedge clk) begin
        if (rst)
            count <= 4'b0000;
        else
            count <= count + 1'b1;
    end

    `ifdef FORMAL
    // Formal Property Assumptions & Assertions
    always @(posedge clk) begin
        if (rst) begin
            assert(count == 4'b0000);
        end
    end
    `endif

endmodule

