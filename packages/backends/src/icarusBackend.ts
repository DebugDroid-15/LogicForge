import * as path from 'node:path';
import * as fs from 'node:fs';
import { ProjectManifest, BuildStageResult } from '@logicforge/core';
import { ProcessRunner, LogParser } from '@logicforge/toolchain';

export class IcarusBackend {
  public static async simulate(projectDir: string, manifest: ProjectManifest): Promise<BuildStageResult> {
    const startTime = Date.now();
    const buildDir = path.join(projectDir, 'build');
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    const simExec = path.join(buildDir, 'sim.vvp');
    const vcdPath = path.join(buildDir, 'waveform.vcd');
    const allSources = [...manifest.sources, ...manifest.simulationSources];

    // Compile with iverilog
    const compileArgs = ['-g2012', '-o', simExec, ...allSources];
    const compileRes = await ProcessRunner.run({
      command: 'iverilog',
      args: compileArgs,
      cwd: projectDir,
    });

    const diagnostics = LogParser.parseDiagnostics('iverilog', 'SIMULATE', compileRes.stderr);

    if (compileRes.exitCode !== 0) {
      return {
        stage: 'SIMULATE',
        status: 'FAILED',
        durationMs: Date.now() - startTime,
        stdout: compileRes.stdout,
        stderr: compileRes.stderr,
        diagnostics,
        outputFiles: [],
      };
    }

    // Run simulation with vvp
    const vvpRes = await ProcessRunner.run({
      command: 'vvp',
      args: [simExec],
      cwd: projectDir,
    });

    const vvpDiags = LogParser.parseDiagnostics('vvp', 'SIMULATE', vvpRes.stderr);
    const combinedDiags = [...diagnostics, ...vvpDiags];

    const hasVcd = fs.existsSync(vcdPath);

    return {
      stage: 'SIMULATE',
      status: vvpRes.exitCode === 0 ? 'SUCCESS' : 'FAILED',
      durationMs: Date.now() - startTime,
      stdout: compileRes.stdout + '\n' + vvpRes.stdout,
      stderr: compileRes.stderr + '\n' + vvpRes.stderr,
      diagnostics: combinedDiags,
      outputFiles: hasVcd ? ['build/waveform.vcd'] : [],
    };
  }
}

