import * as path from 'node:path';
import * as fs from 'node:fs';
import { ProjectManifest, BuildStageResult } from '@logicforge/core';
import { ProcessRunner, LogParser } from '@logicforge/toolchain';

export class OpenFPGALoaderBackend {
  public static async program(projectDir: string, manifest: ProjectManifest, bitstreamPath?: string): Promise<BuildStageResult> {
    const startTime = Date.now();
    const binPath = bitstreamPath || path.join(projectDir, 'build', 'hardware.bin');

    if (!fs.existsSync(binPath)) {
      return {
        stage: 'PROGRAM',
        status: 'FAILED',
        durationMs: Date.now() - startTime,
        stdout: '',
        stderr: `Bitstream file not found at ${binPath}`,
        diagnostics: [
          {
            id: 'LF-PROG-001',
            severity: 'ERROR',
            tool: 'openFPGALoader',
            stage: 'PROGRAM',
            message: `Bitstream file missing: ${binPath}. Generate bitstream before programming.`,
          },
        ],
        outputFiles: [],
      };
    }

    const boardFlag = manifest.board ? ['-b', manifest.board.toLowerCase()] : [];
    const res = await ProcessRunner.run({
      command: 'openFPGALoader',
      args: [...boardFlag, binPath],
      cwd: projectDir,
    });

    const diagnostics = LogParser.parseDiagnostics('openFPGALoader', 'PROGRAM', res.stdout + '\n' + res.stderr);

    return {
      stage: 'PROGRAM',
      status: res.exitCode === 0 ? 'SUCCESS' : 'FAILED',
      durationMs: Date.now() - startTime,
      stdout: res.stdout,
      stderr: res.stderr,
      diagnostics,
      outputFiles: [],
    };
  }
}

