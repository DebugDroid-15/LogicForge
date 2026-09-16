export interface FSMState {
  name: string;
  encoding?: string;
  isInitial?: boolean;
}

export interface FSMTransition {
  from: string;
  to: string;
  condition: string;
}

export interface FSMModel {
  name: string;
  stateRegister: string;
  clock: string;
  reset: string;
  states: FSMState[];
  transitions: FSMTransition[];
  unreachableStates: string[];
}

export class FSMService {
  public static extractFSM(fileName: string, content: string): FSMModel[] {
    const fsms: FSMModel[] = [];
    const lines = content.split(/\r?\n/);

    let stateReg = '';
    const states: FSMState[] = [];
    const transitions: FSMTransition[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const stateDeclMatch = line.match(/(?:localparam|parameter)\s+([A-Z_0-9]+)\s*=\s*(\d+'[bhdO][0-9a-fA-F]+|\d+)/g);
      if (stateDeclMatch) {
        for (const m of stateDeclMatch) {
          const parts = m.split(/\s*=\s*/);
          const name = parts[0].replace(/(?:localparam|parameter)\s+/, '').trim();
          const encoding = parts[1].trim();
          if (!states.find(s => s.name === name)) {
            states.push({ name, encoding, isInitial: states.length === 0 });
          }
        }
      }

      if (line.includes('state <=') || line.includes('state =') || line.includes('current_state')) {
        const regMatch = line.match(/(state|current_state|next_state)/);
        if (regMatch) stateReg = regMatch[1];
      }

      const caseStateMatch = line.match(/([A-Z_0-9]+)\s*:\s*(?:begin)?/);
      if (caseStateMatch && states.some(s => s.name === caseStateMatch[1])) {
        const fromState = caseStateMatch[1];
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const subLine = lines[j].trim();
          const nextStateMatch = subLine.match(/(?:state|current_state|next_state)\s*<=?\s*([A-Z_0-9]+)/);
          if (nextStateMatch && states.some(s => s.name === nextStateMatch[1])) {
            transitions.push({
              from: fromState,
              to: nextStateMatch[1],
              condition: subLine.includes('if') ? subLine : 'unconditional'
            });
          }
        }
      }
    }

    if (states.length > 0) {
      fsms.push({
        name: 'fsm_inst',
        stateRegister: stateReg || 'state',
        clock: 'clk',
        reset: 'rst',
        states,
        transitions,
        unreachableStates: []
      });
    }

    return fsms;
  }
}

