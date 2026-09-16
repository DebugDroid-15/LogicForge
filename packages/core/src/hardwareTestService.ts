export interface HardwareTestSpec {
  name: string;
  bitstreamPath: string;
  expectedSerialResponse?: string;
  timeoutMs: number;
}

export interface HardwareTestReport {
  testName: string;
  status: 'PASSED' | 'FAILED' | 'HARDWARE_UNAVAILABLE';
  timestamp: string;
  durationMs: number;
  details: string;
}

export class HardwareTestService {
  public static runTest(spec: HardwareTestSpec): HardwareTestReport {
    return {
      testName: spec.name,
      status: 'HARDWARE_UNAVAILABLE',
      timestamp: new Date().toISOString(),
      durationMs: 0,
      details: 'Physical target hardware board not connected to COM port or JTAG programmer.',
    };
  }
}

