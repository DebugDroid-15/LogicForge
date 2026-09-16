export interface BuildHistoryRecord {
  buildId: string;
  commit?: string;
  timestamp: string;
  device: string;
  lutsUsed: number;
  ffsUsed: number;
  bramsUsed: number;
  timingSlackNs: number;
  bitstreamSizeBytes: number;
}

export class ResourceTrendingService {
  private static history: BuildHistoryRecord[] = [];

  public static addBuildRecord(record: BuildHistoryRecord): void {
    this.history.push(record);
  }

  public static getHistory(): BuildHistoryRecord[] {
    return this.history;
  }

  public static compareBuilds(id1: string, id2: string): any {
    const b1 = this.history.find(b => b.buildId === id1);
    const b2 = this.history.find(b => b.buildId === id2);
    if (!b1 || !b2) {
      return { status: 'ERROR', message: 'One or both build IDs not found.' };
    }
    return {
      id1,
      id2,
      lutDelta: b2.lutsUsed - b1.lutsUsed,
      ffDelta: b2.ffsUsed - b1.ffsUsed,
      bramDelta: b2.bramsUsed - b1.bramsUsed,
      timingSlackDelta: b2.timingSlackNs - b1.timingSlackNs
    };
  }
}

