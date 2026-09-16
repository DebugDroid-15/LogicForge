import { DiagnosticMessage } from './types.js';

export class ResetService {
  public static analyzeResets(fileName: string, content: string): DiagnosticMessage[] {
    const diagnostics: DiagnosticMessage[] = [];
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('posedge rst') || line.includes('negedge rst_n')) {
        diagnostics.push({
          id: 'RESET-001',
          severity: 'WARNING',
          tool: 'LogicForge Reset Analysis',
          stage: 'ANALYSIS',
          file: fileName,
          line: i + 1,
          message: 'Asynchronous reset release condition check: ensure reset synchronizer is present to avoid metastability during de-assertion.',
          possibleCause: 'Asynchronous reset de-assertion timing violation.'
        });
      }
    }

    return diagnostics;
  }
}

