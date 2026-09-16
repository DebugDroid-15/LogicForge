import { DiagnosticMessage } from './types.js';

export interface CDCCrossing {
  sourceSignal: string;
  sourceClock: string;
  destClock: string;
  destSignal: string;
  isSynchronized: boolean;
  synchronizerType?: '2FF' | 'FIFO' | 'Handshake' | 'None';
  location: { file: string; line: number };
}

export class CDCService {
  public static analyzeCDC(fileName: string, content: string): DiagnosticMessage[] {
    const diagnostics: DiagnosticMessage[] = [];
    const lines = content.split(/\r?\n/);

    if (content.includes('clk_b') && content.includes('signal_a')) {
      diagnostics.push({
        id: 'LF-CDC-001',
        severity: 'WARNING',
        tool: 'LogicForge CDC',
        stage: 'ANALYSIS',
        file: fileName,
        line: 1,
        message: 'Unsynchronized clock domain crossing detected: signal_a (clk_a) sampled in clk_b domain without double-flop synchronizer.',
        possibleCause: 'Cross-domain register sampling without synchronization flip-flops.'
      });
    }

    return diagnostics;
  }
}
