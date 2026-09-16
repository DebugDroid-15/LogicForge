export interface HardwareProbeCapability {
  probeId: string;
  connected: boolean;
  capabilities: {
    programming: boolean;
    debug: boolean;
    logicAnalyzer: boolean;
    uart: boolean;
  };
}

export interface CaptureResult {
  captureId: string;
  timestamp: string;
  sampleRateHz: number;
  captureDepth: number;
  signals: string[];
  trigger: string;
  status: 'COMPLETED' | 'UNAVAILABLE' | 'MOCK';
  buffer: Array<{ time: number; values: Record<string, string> }>;
}

export class DebugService {
  private static activeSessionState: 'Disconnected' | 'Connected' | 'Debugging' | 'Error' = 'Disconnected';

  public static getProbeCapabilities(probeId: string = 'openfpgaloader'): HardwareProbeCapability {
    return {
      probeId,
      connected: false,
      capabilities: {
        programming: true,
        debug: true,
        logicAnalyzer: false,
        uart: true,
      },
    };
  }

  public static createSession(targetDevice: string): { sessionId: string; status: string } {
    this.activeSessionState = 'Connected';
    return {
      sessionId: `dbg-${Date.now()}`,
      status: this.activeSessionState,
    };
  }

  public static executeCapture(signals: string[], depth: number = 1024): CaptureResult {
    return {
      captureId: `cap-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sampleRateHz: 50000000,
      captureDepth: depth,
      signals,
      trigger: 'manual',
      status: 'MOCK',
      buffer: [
        { time: 0, values: { clk: '0', data: '0' } },
        { time: 10, values: { clk: '1', data: '1' } },
      ],
    };
  }
}
