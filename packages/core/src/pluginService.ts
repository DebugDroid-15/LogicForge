export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  category: 'Backend' | 'Board' | 'Device' | 'Simulator' | 'Programmer' | 'Debugger';
  description: string;
}

export class PluginService {
  private static registeredPlugins: PluginManifest[] = [
    {
      id: 'backend-open-toolchain',
      name: 'LogicForge Open FPGA Backend Plugin',
      version: '1.0.0',
      author: 'LogicForge Team',
      category: 'Backend',
      description: 'Builtin backend plugin supporting Yosys, nextpnr, and openFPGALoader.'
    }
  ];

  public static listPlugins(): PluginManifest[] {
    return this.registeredPlugins;
  }

  public static registerPlugin(manifest: PluginManifest): void {
    this.registeredPlugins.push(manifest);
  }
}
