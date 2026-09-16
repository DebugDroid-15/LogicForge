import { ResourceUtilization } from './types.js';

export class ResourceAnalysisService {
  public static parseYosysReport(reportText: string): ResourceUtilization {
    const res: ResourceUtilization = {
      luts: { used: 0, available: 1280, percentage: 0 },
      flipFlops: { used: 0, available: 1280, percentage: 0 },
      bram: { used: 0, available: 16, percentage: 0 },
      dsp: { used: 0, available: 0, percentage: 0 },
      io: { used: 0, available: 96, percentage: 0 },
    };

    const lutMatch = reportText.match(/SB_LUT4\s+(\d+)/) || reportText.match(/TRELLIS_SLICE\s+(\d+)/);
    if (lutMatch) {
      res.luts.used = parseInt(lutMatch[1], 10);
      res.luts.percentage = Math.round((res.luts.used / res.luts.available) * 100);
    }

    const ffMatch = reportText.match(/SB_DFF\w*\s+(\d+)/);
    if (ffMatch) {
      res.flipFlops.used = parseInt(ffMatch[1], 10);
      res.flipFlops.percentage = Math.round((res.flipFlops.used / res.flipFlops.available) * 100);
    }

    const bramMatch = reportText.match(/SB_RAM\w*\s+(\d+)/) || reportText.match(/DP16KD\s+(\d+)/);
    if (bramMatch) {
      res.bram.used = parseInt(bramMatch[1], 10);
      res.bram.percentage = Math.round((res.bram.used / res.bram.available) * 100);
    }

    return res;
  }
}
