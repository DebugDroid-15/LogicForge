import * as fs from 'node:fs';
import * as path from 'node:path';
import { ProjectManifest, ToolchainConfig, TargetDevice } from './types.js';

export class ProjectManager {
  public static MANIFEST_NAME = 'logicforge.project';

  public static createProject(
    projectDir: string,
    options: {
      name: string;
      topModule?: string;
      language?: 'Verilog' | 'SystemVerilog' | 'VHDL';
      board?: string;
      target?: Partial<TargetDevice>;
      toolchain?: Partial<ToolchainConfig>;
      template?: string;
    }
  ): { manifestPath: string; manifest: ProjectManifest } {
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const defaultTarget: TargetDevice = {
      vendor: options.target?.vendor || 'Lattice',
      family: options.target?.family || 'iCE40',
      part: options.target?.part || 'iCE40HX1K-TQ144',
      package: options.target?.package || 'TQ144',
    };

    const defaultToolchain: ToolchainConfig = {
      synthesis: options.toolchain?.synthesis || 'yosys',
      simulation: options.toolchain?.simulation || 'icarus',
      placeAndRoute: options.toolchain?.placeAndRoute || 'nextpnr',
      programmer: options.toolchain?.programmer || 'openfpgaloader',
    };

    const manifest: ProjectManifest = {
      name: options.name,
      version: '0.1.0',
      topModule: options.topModule || 'top',
      language: options.language || 'Verilog',
      sources: ['rtl/top.v'],
      simulationSources: ['sim/tb_top.v'],
      constraints: ['constraints/pins.xdc'],
      target: defaultTarget,
      board: options.board || 'iCEstick',
      toolchain: defaultToolchain,
    };

    // Create folder structure
    const folders = ['rtl', 'sim', 'constraints', 'ip', 'scripts', 'build', 'reports', '.logicforge'];
    for (const f of folders) {
      fs.mkdirSync(path.join(projectDir, f), { recursive: true });
    }

    // Write initial source files if template requested
    this.populateTemplate(projectDir, manifest, options.template || 'blink');

    const manifestPath = path.join(projectDir, this.MANIFEST_NAME);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    return { manifestPath, manifest };
  }

  public static loadProject(projectPath: string): ProjectManifest {
    const fullPath = fs.statSync(projectPath).isDirectory()
      ? path.join(projectPath, this.MANIFEST_NAME)
      : projectPath;

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Project manifest not found at: ${fullPath}`);
    }

    const raw = fs.readFileSync(fullPath, 'utf-8');
    const manifest = JSON.parse(raw) as ProjectManifest;
    return manifest;
  }

  public static saveProject(projectDir: string, manifest: ProjectManifest): void {
    const manifestPath = path.join(projectDir, this.MANIFEST_NAME);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  }

  private static populateTemplate(projectDir: string, manifest: ProjectManifest, template: string): void {
    if (template === 'blink' || template === 'hello_led') {
      const topV = `// LogicForge Template: Blink LED
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
`;
      const tbV = `\`timescale 1ns/1ps
module tb_top;
    reg clk = 0;
    wire led;

    top uut (
        .clk(clk),
        .led(led)
    );

    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/waveform.vcd");
        $dumpvars(0, tb_top);
        #1000;
        $finish;
    end
endmodule
`;
      const xdc = `# Pin Constraints for LogicForge Project
set_property PACKAGE_PIN 21 [get_ports clk]
set_property IOSTANDARD LVCMOS33 [get_ports clk]

set_property PACKAGE_PIN 99 [get_ports led]
set_property IOSTANDARD LVCMOS33 [get_ports led]
`;
      fs.writeFileSync(path.join(projectDir, 'rtl', 'top.v'), topV, 'utf-8');
      fs.writeFileSync(path.join(projectDir, 'sim', 'tb_top.v'), tbV, 'utf-8');
      fs.writeFileSync(path.join(projectDir, 'constraints', 'pins.xdc'), xdc, 'utf-8');
    } else if (template === 'counter') {
      const topV = `// LogicForge Template: 8-bit Counter
module top (
    input wire clk,
    input wire rst,
    output reg [7:0] count
);
    always @(posedge clk or posedge rst) begin
        if (rst)
            count <= 8'd0;
        else
            count <= count + 1'b1;
    end
endmodule
`;
      const tbV = `\`timescale 1ns/1ps
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
`;
      fs.writeFileSync(path.join(projectDir, 'rtl', 'top.v'), topV, 'utf-8');
      fs.writeFileSync(path.join(projectDir, 'sim', 'tb_top.v'), tbV, 'utf-8');
    }
  }
}

