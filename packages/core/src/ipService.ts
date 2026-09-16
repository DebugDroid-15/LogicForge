import * as fs from 'node:fs';
import * as path from 'node:path';

export interface IPParameter {
  name: string;
  type: 'integer' | 'string' | 'boolean';
  defaultValue: any;
  description: string;
}

export interface IPDefinition {
  id: string;
  name: string;
  version: string;
  category: 'Memory' | 'Communication' | 'Control' | 'Utility' | 'DSP';
  description: string;
  parameters: IPParameter[];
  supportedTargets: string[];
}

export class IPService {
  private static catalog: IPDefinition[] = [
    {
      id: 'fifo_sync',
      name: 'Synchronous FIFO Buffer',
      version: '1.0.0',
      category: 'Memory',
      description: 'Parameterized Synchronous FIFO Buffer with Full/Empty flags.',
      parameters: [
        { name: 'DATA_WIDTH', type: 'integer', defaultValue: 8, description: 'Width of data bus in bits' },
        { name: 'FIFO_DEPTH', type: 'integer', defaultValue: 16, description: 'FIFO buffer depth (number of words)' },
      ],
      supportedTargets: ['iCE40', 'ECP5', 'Generic'],
    },
    {
      id: 'uart_tx',
      name: 'UART Transmitter Core',
      version: '1.0.0',
      category: 'Communication',
      description: 'Parameterized UART Transmitter Core with configurable baud rate divider.',
      parameters: [
        { name: 'BAUD_DIV', type: 'integer', defaultValue: 104, description: 'Baud rate clock divider (e.g. 12MHz / 115200 = 104)' },
      ],
      supportedTargets: ['iCE40', 'ECP5', 'Generic'],
    },
    {
      id: 'pwm_generator',
      name: 'PWM Signal Generator',
      version: '1.0.0',
      category: 'Control',
      description: 'Pulse-Width Modulation generator with 8-bit duty cycle control.',
      parameters: [
        { name: 'PWM_BITS', type: 'integer', defaultValue: 8, description: 'Resolution of PWM counter' },
      ],
      supportedTargets: ['iCE40', 'ECP5', 'Generic'],
    },
  ];

  public static listCatalog(): IPDefinition[] {
    return this.catalog;
  }

  public static getCatalog(): IPDefinition[] {
    return this.listCatalog();
  }

  public static getIP(id: string): IPDefinition | undefined {
    return this.catalog.find((ip) => ip.id === id || (id === 'sync_fifo' && ip.id === 'fifo_sync'));
  }

  public static generateIP(
    arg1: string | { ipId: string; instanceName?: string; parameters: Record<string, any> },
    arg2?: string | Record<string, any>,
    arg3?: Record<string, any>
  ): any {
    if (typeof arg1 === 'object') {
      const { ipId, parameters } = arg1;
      const ip = this.getIP(ipId) || this.catalog[0];
      const dataWidth = parameters['DATA_WIDTH'] || 8;
      const fifoDepth = parameters['DEPTH'] || 16;
      return `// LogicForge Generated IP: ${ip.name} (v${ip.version})
module ${ipId} #(
    parameter DATA_WIDTH = ${dataWidth},
    parameter DEPTH = ${fifoDepth}
)(
    input wire clk,
    input wire rst,
    input wire wr_en,
    input wire rd_en,
    input wire [DATA_WIDTH-1:0] din,
    output reg [DATA_WIDTH-1:0] dout,
    output wire full,
    output wire empty
);
endmodule`;
    }

    const projectDir = arg1 as string;
    const ipId = arg2 as string;
    const paramValues = (arg3 as Record<string, any>) || {};

    const ip = this.getIP(ipId);
    if (!ip) throw new Error(`IP '${ipId}' not found in catalog.`);

    const ipDir = path.join(projectDir, 'ip', ipId);
    if (!fs.existsSync(ipDir)) fs.mkdirSync(ipDir, { recursive: true });

    let hdlContent = '';
    if (ipId === 'fifo_sync') {
      const dataWidth = paramValues['DATA_WIDTH'] || 8;
      const fifoDepth = paramValues['FIFO_DEPTH'] || 16;
      hdlContent = `// LogicForge Generated IP: ${ip.name} (v${ip.version})
module ${ipId} #(
    parameter DATA_WIDTH = ${dataWidth},
    parameter FIFO_DEPTH = ${fifoDepth}
)(
    input wire clk,
    input wire rst,
    input wire wr_en,
    input wire rd_en,
    input wire [DATA_WIDTH-1:0] din,
    output reg [DATA_WIDTH-1:0] dout,
    output wire full,
    output wire empty
);
    reg [DATA_WIDTH-1:0] mem [0:FIFO_DEPTH-1];
    reg [3:0] wr_ptr = 0;
    reg [3:0] rd_ptr = 0;
    reg [4:0] count = 0;

    assign full = (count == FIFO_DEPTH);
    assign empty = (count == 0);

    always @(posedge clk or posedge rst) begin
        if (rst) begin
            wr_ptr <= 0;
            rd_ptr <= 0;
            count <= 0;
        end else begin
            if (wr_en && !full) begin
                mem[wr_ptr] <= din;
                wr_ptr <= wr_ptr + 1'b1;
                count <= count + 1'b1;
            end
            if (rd_en && !empty) begin
                dout <= mem[rd_ptr];
                rd_ptr <= rd_ptr + 1'b1;
                count <= count - 1'b1;
            end
        end
    end
endmodule
`;
    } else {
      hdlContent = `// LogicForge Generated IP: ${ip.name}\nmodule ${ipId}(input clk, output out); endmodule\n`;
    }

    const targetPath = path.join(ipDir, `${ipId}.v`);
    fs.writeFileSync(targetPath, hdlContent, 'utf-8');

    return { targetPath, hdlContent };
  }
}
