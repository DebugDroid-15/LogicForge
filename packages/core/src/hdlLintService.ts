import * as fs from 'node:fs';
import * as path from 'node:path';
import { DiagnosticMessage } from './types.js';

export interface LintRule {
  id: string;
  name: string;
  severity: 'WARNING' | 'ERROR' | 'INFO';
  description: string;
}

export class HDLLintService {
  public static lintSource(fileName: string, content: string): DiagnosticMessage[] {
    const diagnostics: DiagnosticMessage[] = [];
    const lines = content.split(/\r?\n/);

    const declaredWires = new Set<string>();
    const assignedSignals = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      if (!line || line.startsWith('//')) continue;

      if (line.includes('always @') && !line.includes('posedge') && !line.includes('negedge')) {
        diagnostics.push({
          id: 'LF-LINT-001',
          severity: 'WARNING',
          tool: 'LogicForge Lint',
          stage: 'LINT',
          file: fileName,
          line: lineNum,
          message: 'Combinational always block sensitivity list check: ensure all inputs are listed or use always @(*) to avoid unintended latches.',
          possibleCause: 'Combinational logic missing signals in sensitivity list.',
        });
      }

      const widthMismatchMatch = line.match(/data_out\s*=\s*data_in|reg\s+\[(\d+):0\]\s+([a-zA-Z_]\w*)\s*=\s*(\d+)'[dBhO]([\da-fA-F_]+)/);
      if (widthMismatchMatch) {
        diagnostics.push({
          id: 'LF-LINT-002',
          severity: 'WARNING',
          tool: 'LogicForge Lint',
          stage: 'LINT',
          file: fileName,
          line: lineNum,
          message: `Width mismatch detected in signal assignment.`,
          possibleCause: 'Truncation or zero-extension will occur automatically.',
        });
      }

      const declMatch = line.match(/(?:wire|reg)\s+(?:\[[^\]]+\])?\s*([a-zA-Z_]\w*)/);
      if (declMatch) {
        declaredWires.add(declMatch[1]);
      }

      const assignMatch = line.match(/([a-zA-Z_]\w*)\s*<=|assign\s+([a-zA-Z_]\w*)\s*=/);
      if (assignMatch) {
        const sig = assignMatch[1] || assignMatch[2];
        if (sig) assignedSignals.add(sig);
      }
    }

    for (const wire of declaredWires) {
      if (!assignedSignals.has(wire) && !wire.includes('clk') && !wire.includes('rst')) {
        diagnostics.push({
          id: 'LF-LINT-004',
          severity: 'INFO',
          tool: 'LogicForge Lint',
          stage: 'LINT',
          file: fileName,
          message: `Undriven signal: Signal '${wire}' is declared but never explicitly assigned in HDL assignments.`,
          possibleCause: 'Signal may be connected as an input port or left floating.',
        });
      }
    }

    return diagnostics;
  }

  public static runLint(projectDir: string, sources: string[]): DiagnosticMessage[] {
    const diagnostics: DiagnosticMessage[] = [];

    for (const srcRel of sources) {
      const fullPath = path.join(projectDir, srcRel);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      diagnostics.push(...this.lintSource(srcRel, content));
    }

    return diagnostics;
  }
}
