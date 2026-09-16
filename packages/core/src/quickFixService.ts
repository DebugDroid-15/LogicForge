import { DiagnosticMessage } from './types.js';

export interface QuickFix {
  id: string;
  title: string;
  diagnosticId: string;
  replacementText: string;
}

export class QuickFixService {
  public static getFixes(diagnostic: DiagnosticMessage): QuickFix[] {
    const fixes: QuickFix[] = [];
    if (diagnostic.id === 'LF-LINT-001') {
      fixes.push({
        id: 'fix-latch-always-star',
        title: 'Replace sensitivity list with always @(*)',
        diagnosticId: diagnostic.id,
        replacementText: 'always @(*)'
      });
    } else if (diagnostic.id === 'LF-LINT-002') {
      fixes.push({
        id: 'fix-width-pad',
        title: 'Match vector assignment width',
        diagnosticId: diagnostic.id,
        replacementText: "4'd0"
      });
    }
    return fixes;
  }
}

