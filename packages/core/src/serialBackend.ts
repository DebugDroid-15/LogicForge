export interface SerialOptions {
  port: string;
  baudRate: number;
  dataBits?: 8 | 7 | 6 | 5;
  parity?: 'none' | 'even' | 'odd';
  stopBits?: 1 | 2;
}

export interface SerialLineMessage {
  timestamp: string;
  direction: 'RX' | 'TX';
  data: string;
}

export class SerialBackend {
  private isConnected = false;
  private options: SerialOptions | null = null;
  private log: SerialLineMessage[] = [];
  private onDataCallback: ((msg: SerialLineMessage) => void) | null = null;

  public enumeratePorts(): string[] {
    return ['COM1', 'COM7 (FTDI UART)', 'COM8', '/dev/ttyUSB0', '/dev/ttyUSB1'];
  }

  public open(options: SerialOptions): boolean {
    this.options = options;
    this.isConnected = true;
    const initMsg: SerialLineMessage = {
      timestamp: new Date().toISOString(),
      direction: 'RX',
      data: `[UART Opened @ ${options.port}, ${options.baudRate} 8N1]`,
    };
    this.log.push(initMsg);
    if (this.onDataCallback) this.onDataCallback(initMsg);
    return true;
  }

  public close(): void {
    if (this.isConnected) {
      const closeMsg: SerialLineMessage = {
        timestamp: new Date().toISOString(),
        direction: 'RX',
        data: `[UART Closed]`,
      };
      this.log.push(closeMsg);
      if (this.onDataCallback) this.onDataCallback(closeMsg);
    }
    this.isConnected = false;
  }

  public write(data: string): void {
    if (!this.isConnected) return;
    const msg: SerialLineMessage = {
      timestamp: new Date().toISOString(),
      direction: 'TX',
      data,
    };
    this.log.push(msg);
    if (this.onDataCallback) this.onDataCallback(msg);
  }

  public onData(callback: (msg: SerialLineMessage) => void): void {
    this.onDataCallback = callback;
  }

  public getLog(): SerialLineMessage[] {
    return this.log;
  }

  public clearLog(): void {
    this.log = [];
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

