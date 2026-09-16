export interface WorkspaceState {
  activeTab: string;
  activeBottomPanel: string;
  openFiles: string[];
  selectedFile?: string;
  sidebarCollapsed: boolean;
}

export class WorkspaceService {
  private static defaultState: WorkspaceState = {
    activeTab: 'DESIGN',
    activeBottomPanel: 'BUILD',
    openFiles: ['rtl/top.v'],
    selectedFile: 'rtl/top.v',
    sidebarCollapsed: false,
  };

  public static getDefaultState(): WorkspaceState {
    return { ...this.defaultState };
  }
}

