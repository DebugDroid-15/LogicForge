// LogicForge Block Design Auto-Generated Top Module
module block_design_top (
    input wire clk,
    output wire [7:0] led_out
);

    wire [7:0] count_val;

    counter_8bit u_counter (
        .clk(clk),
        .count(count_val)
    );

    led_driver u_driver (
        .din(count_val),
        .dout(led_out)
    );

endmodule

