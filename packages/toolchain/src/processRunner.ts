import { spawn } from 'node:child_process';
import { DiagnosticMessage } from '@logicforge/core';

export interface ProcessRunOptions {
  command: string;
  args: string[];
  cwd?: string;
  timeoutMs?: number;
  env?: Record<string, string>;
  onStdoutLine?: (line: string) => void;
  onStderrLine?: (line: string) => void;
}

export interface ProcessRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  commandString: string;
}

export class ProcessRunner {
  public static async run(options: ProcessRunOptions): Promise<ProcessRunResult> {
    const startTime = Date.now();
    const commandStr = `${options.command} ${options.args.join(' ')}`;

    return new Promise((resolve) => {
      let stdoutAcc = '';
      let stderrAcc = '';
      let stdoutBuffer = '';
      let stderrBuffer = '';

      const childEnv = { ...process.env, ...options.env };
      const child = spawn(options.command, options.args, {
        cwd: options.cwd || process.cwd(),
        env: childEnv,
        shell: true,
      });

      let timer: NodeJS.Timeout | null = null;
      if (options.timeoutMs) {
        timer = setTimeout(() => {
          child.kill('SIGKILL');
        }, options.timeoutMs);
      }

      child.stdout.on('data', (chunk: Buffer) => {
        const str = chunk.toString('utf-8');
        stdoutAcc += str;
        stdoutBuffer += str;
        const lines = stdoutBuffer.split(/\r?\n/);
        stdoutBuffer = lines.pop() || '';
        for (const line of lines) {
          if (options.onStdoutLine) options.onStdoutLine(line);
        }
      });

      child.stderr.on('data', (chunk: Buffer) => {
        const str = chunk.toString('utf-8');
        stderrAcc += str;
        stderrBuffer += str;
        const lines = stderrBuffer.split(/\r?\n/);
        stderrBuffer = lines.pop() || '';
        for (const line of lines) {
          if (options.onStderrLine) options.onStderrLine(line);
        }
      });

      child.on('close', (code) => {
        if (timer) clearTimeout(timer);
        if (stdoutBuffer && options.onStdoutLine) options.onStdoutLine(stdoutBuffer);
        if (stderrBuffer && options.onStderrLine) options.onStderrLine(stderrBuffer);

        const durationMs = Date.now() - startTime;
        resolve({
          exitCode: code ?? 1,
          stdout: stdoutAcc,
          stderr: stderrAcc,
          durationMs,
          commandString: commandStr,
        });
      });

      child.on('error', (err) => {
        if (timer) clearTimeout(timer);
        const durationMs = Date.now() - startTime;
        resolve({
          exitCode: 1,
          stdout: stdoutAcc,
          stderr: stderrAcc + `\nProcess execution error: ${err.message}`,
          durationMs,
          commandString: commandStr,
        });
      });
    });
  }
}

