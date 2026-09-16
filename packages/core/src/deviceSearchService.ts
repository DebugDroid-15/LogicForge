export interface DeviceSpec {
  part: string;
  family: string;
  vendor: string;
  package: string;
  lutCount: number;
  ffCount: number;
  bramCount: number;
}

export class DeviceSearchService {
  private static db: DeviceSpec[] = [
    { part: 'iCE40HX1K-TQ144', family: 'iCE40', vendor: 'Lattice', package: 'TQ144', lutCount: 1280, ffCount: 1280, bramCount: 16 },
    { part: 'iCE40HX8K-CT256', family: 'iCE40', vendor: 'Lattice', package: 'CT256', lutCount: 7680, ffCount: 7680, bramCount: 32 },
    { part: 'LFE5U-25F-8BG381C', family: 'ECP5', vendor: 'Lattice', package: 'CABGA381', lutCount: 24000, ffCount: 24000, bramCount: 56 },
    { part: 'GW1N-UV4LQ144C6/I5', family: 'GW1N', vendor: 'Gowin', package: 'LQFP144', lutCount: 1152, ffCount: 864, bramCount: 4 },
  ];

  public static search(query: string): DeviceSpec[] {
    const q = query.toLowerCase();
    return this.db.filter(d => d.part.toLowerCase().includes(q) || d.family.toLowerCase().includes(q) || d.vendor.toLowerCase().includes(q));
  }

  public static getDevice(part: string): DeviceSpec | undefined {
    return this.db.find(d => d.part === part);
  }
}

