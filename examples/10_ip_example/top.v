module fifo_top(
    input wire clk,
    input wire rst,
    input wire wr_en,
    input wire rd_en,
    input wire [7:0] din,
    output wire [7:0] dout,
    output wire full,
    output wire empty
);

    fifo_sync #(
        .DATA_WIDTH(8),
        .FIFO_DEPTH(16)
    ) u_fifo (
        .clk(clk),
        .rst(rst),
        .wr_en(wr_en),
        .rd_en(rd_en),
        .din(din),
        .dout(dout),
        .full(full),
        .empty(empty)
    );

endmodule

