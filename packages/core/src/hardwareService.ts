import { EventBus } from './eventBus.js';
import { BoardDefinition } from './types.js';

export type HardwareState =
  | 'Disconnected'
  | 'Detected'
  | 'Connecting'
  | 'Connected'
  | 'Programming'
  | 'Programmed'
  | 'Error';

export interface HardwareDeviceInfo {
  boardId: string;
  name: string;
  fpgaPart: string;
  port: string;
  vendorId: string;
  productId: string;
  state: HardwareState;
}

export class HardwareService {
  private static instance: HardwareService;
  private state: HardwareState = 'Disconnected';
  private currentDevice: HardwareDeviceInfo | null = null;
  private eventBus = EventBus.getInstance();

  private constructor() {}

  public static getInstance(): HardwareService {
    if (!HardwareService.instance) {
      HardwareService.instance = new HardwareService();
    }
    return HardwareService.instance;
  }

  public async enumerate(): Promise<HardwareDeviceInfo[]> {
    // Detect connected USB/JTAG devices (FTDI FT2232H / openFPGALoader compatible)
    const mockDetected: HardwareDeviceInfo = {
      boardId: 'icestick',
      name: 'Lattice iCEstick Evaluation Kit',
      fpgaPart: 'iCE40HX1K-TQ144',
      port: 'COM7 / USB0',
      vendorId: '0403',
      productId: '6010',
      state: 'Detected',
    };

    this.currentDevice = mockDetected;
    this.setState('Detected');
    this.eventBus.emit('HARDWARE_CONNECTED', mockDetected);

    return [mockDetected];
  }

  public async connect(boardId: string): Promise<boolean> {
    this.setState('Connecting');
    if (this.currentDevice && this.currentDevice.boardId === boardId) {
      this.setState('Connected');
      return true;
    }
    this.setState('Error');
    return false;
  }

  public async disconnect(): Promise<void> {
    this.setState('Disconnected');
    this.currentDevice = null;
    this.eventBus.emit('HARDWARE_DISCONNECTED');
  }

  public getState(): HardwareState {
    return this.state;
  }

  public getCurrentDevice(): HardwareDeviceInfo | null {
    return this.currentDevice;
  }

  public setState(newState: HardwareState): void {
    this.state = newState;
    if (this.currentDevice) this.currentDevice.state = newState;
  }
}

