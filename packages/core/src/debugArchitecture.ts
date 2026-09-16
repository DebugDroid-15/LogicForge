export interface DebugProbeCapability {
  available: boolean;
  probeName: string;
  maxSampleRateMHz: number;
  bufferDepth: number;
  reasonIfUnavailable?: string;
}

export interface LogicAnalyzerSession {
  sessionId: string;
  status: 'IDLE' | 'ARMED' | 'TRIGGERED' | 'CAPTURING' | 'COMPLETED' | 'UNAVAILABLE';
  signals: string[];
  sampleBuffer: Array<{ time: number; values: Record<string, string> }>;
}

export class DebugArchitectureService {
  public static detectProbe(): DebugProbeCapability {
    return {
      available: false,
      probeName: 'Generic JTAG/SPI Probe',
      maxSampleRateMHz: 50,
      bufferDepth: 1024,
      reasonIfUnavailable: 'No hardware logic analyzer probe hardware connected on active JTAG interface.'
    };
  }
}

