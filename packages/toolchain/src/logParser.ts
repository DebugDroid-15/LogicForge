import { DiagnosticMessage, Severity } from '@logicforge/core';

export class LogParser {
  public static parseDiagnostics(tool: string, stage: string, output: string): DiagnosticMessage[] {
    const diagnostics: DiagnosticMessage[] = [];
    const lines = output.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Verilator / Icarus style: "top.v:10: error: undeclared signal..."
      const gccStyleMatch = line.match(/^([^:]+):(\d+)(?::(\d+))?:\s*(error|warning|info|fatal)?:\s*(.*)$/i);
      if (gccStyleMatch) {
        const [, file, lineStr, colStr, sevStr, msg] = gccStyleMatch;
        const severity = this.mapSeverity(sevStr || 'error');
        diagnostics.push({
          id: `LF-DIAG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          severity,
          tool,
          stage,
          file,
          line: parseInt(lineStr, 10),
          column: colStr ? parseInt(colStr, 10) : undefined,
          message: msg,
          rawLine: line,
          possibleCause: this.inferPossibleCause(msg),
        });
        continue;
      }

      // Yosys style: "ERROR: Undeclared signal..." or "Warning: ..."
      const yosysStyleMatch = line.match(/^(ERROR|Warning|Fatal):\s*(.*)$/i);
      if (yosysStyleMatch) {
        const [, sevStr, msg] = yosysStyleMatch;
        const severity = this.mapSeverity(sevStr);
        diagnostics.push({
          id: `LF-YOSYS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          severity,
          tool,
          stage,
          message: msg,
          rawLine: line,
          possibleCause: this.inferPossibleCause(msg),
        });
      }
    }

    return diagnostics;
  }

  private static mapSeverity(sevStr: string): Severity {
    const lower = sevStr.toLowerCase();
    if (lower.includes('warning') || lower.includes('warn')) return 'WARNING';
    if (lower.includes('info')) return 'INFO';
    if (lower.includes('fatal')) return 'FATAL';
    return 'ERROR';
  }

  private static inferPossibleCause(msg: string): string | undefined {
    const lower = msg.toLowerCase();
    if (lower.includes('undeclared') || lower.includes('not defined')) {
      return 'Check signal definition, wire/reg declaration, or typo in module signal name.';
    }
    if (lower.includes('syntax error')) {
      return 'Check missing semicolon, mismatched brackets, or keyword typo near line.';
    }
    if (lower.includes('latch')) {
      return 'Inferred unintended latch. Ensure all branches in always block assign outputs.';
    }
    if (lower.includes('multiple drivers')) {
      return 'Signal is driven by more than one process or continuous assignment.';
    }
    return undefined;
  }
}

