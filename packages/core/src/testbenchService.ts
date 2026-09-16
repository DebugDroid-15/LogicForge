export interface TestbenchSpec {
  name: string;
  top: string;
  sources: string[];
  defines?: Record<string, string>;
  includeDirs?: string[];
  simulator: 'icarus' | 'verilator';
}

export class TestbenchService {
  public static listTestbenches(projectManifest: any): TestbenchSpec[] {
    return (projectManifest.simulationSources || []).map((src: string) => ({
      name: src.replace(/\.[^/.]+$/, ''),
      top: 'tb_top',
      sources: [src, ...(projectManifest.sources || [])],
      simulator: projectManifest.toolchain?.simulation || 'icarus'
    }));
  }
}

