export interface BackendCapability {
  family: string;
  vendor: string;
  synthesis: boolean;
  placeAndRoute: boolean;
  timing: boolean;
  bitstream: boolean;
  programming: boolean;
  hardwareDebug: boolean;
}

export class BackendRegistry {
  private static backends: BackendCapability[] = [
    {
      family: 'iCE40',
      vendor: 'Lattice',
      synthesis: true,
      placeAndRoute: true,
      timing: true,
      bitstream: true,
      programming: true,
      hardwareDebug: false,
    },
    {
      family: 'ECP5',
      vendor: 'Lattice',
      synthesis: true,
      placeAndRoute: true,
      timing: true,
      bitstream: true,
      programming: true,
      hardwareDebug: false,
    },
    {
      family: 'GW1N',
      vendor: 'Gowin',
      synthesis: true,
      placeAndRoute: false,
      timing: false,
      bitstream: false,
      programming: false,
      hardwareDebug: false,
    },
  ];

  public static getCapabilities(): BackendCapability[] {
    return this.backends;
  }
}

