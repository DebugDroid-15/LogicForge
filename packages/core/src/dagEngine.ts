import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { BuildStage, BuildStatus } from './types.js';

export interface DAGNode {
  id: BuildStage;
  dependencies: BuildStage[];
  outputs: string[];
}

export interface BuildManifestCache {
  hashes: Record<string, string>;
  lastBuildTime: string;
  stageResults: Record<string, { status: BuildStatus; outputs: string[] }>;
}

export class DAGBuildEngine {
  private nodes: Map<BuildStage, DAGNode> = new Map();

  constructor() {
    this.registerNode({ id: 'PARSE', dependencies: [], outputs: [] });
    this.registerNode({ id: 'SIMULATE', dependencies: ['PARSE'], outputs: ['build/waveform.vcd'] });
    this.registerNode({ id: 'ELABORATION', dependencies: ['PARSE'], outputs: ['build/elaborated.json'] });
    this.registerNode({ id: 'SYNTHESIS', dependencies: ['ELABORATION'], outputs: ['build/synthesis/netlist.json', 'build/synthesis/synth.v'] });
    this.registerNode({ id: 'PLACE', dependencies: ['SYNTHESIS'], outputs: ['build/placed.asc'] });
    this.registerNode({ id: 'ROUTE', dependencies: ['PLACE'], outputs: ['build/routed.asc'] });
    this.registerNode({ id: 'TIMING', dependencies: ['ROUTE'], outputs: ['reports/timing.json'] });
    this.registerNode({ id: 'BITSTREAM', dependencies: ['ROUTE'], outputs: ['build/bitstream/hardware.bin'] });
    this.registerNode({ id: 'PROGRAM', dependencies: ['BITSTREAM'], outputs: [] });
  }

  public registerNode(node: DAGNode): void {
    this.nodes.set(node.id, node);
  }

  public getExecutionPlan(targetStage: BuildStage): BuildStage[] {
    const visited = new Set<BuildStage>();
    const plan: BuildStage[] = [];

    const visit = (stage: BuildStage) => {
      if (visited.has(stage)) return;
      visited.add(stage);
      const node = this.nodes.get(stage);
      if (node) {
        for (const dep of node.dependencies) {
          visit(dep);
        }
        plan.push(stage);
      }
    };

    visit(targetStage);
    return plan;
  }

  public shouldSkipStage(projectDir: string, stage: BuildStage, sources: string[]): boolean {
    const cachePath = path.join(projectDir, '.logicforge', 'build-manifest.json');
    if (!fs.existsSync(cachePath)) return false;

    try {
      const cache: BuildManifestCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      const stageRecord = cache.stageResults[stage];
      if (!stageRecord || stageRecord.status !== 'SUCCESS') return false;

      const node = this.nodes.get(stage);
      if (node && node.outputs.length > 0) {
        for (const out of node.outputs) {
          if (!fs.existsSync(path.join(projectDir, out))) return false;
        }
      }

      for (const src of sources) {
        const fullPath = path.join(projectDir, src);
        if (!fs.existsSync(fullPath)) return false;
        const currentHash = this.computeHash(fullPath);
        if (cache.hashes[src] !== currentHash) return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  public updateCache(projectDir: string, stage: BuildStage, status: BuildStatus, sources: string[]): void {
    const cacheDir = path.join(projectDir, '.logicforge');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const cachePath = path.join(cacheDir, 'build-manifest.json');

    let cache: BuildManifestCache = {
      hashes: {},
      lastBuildTime: new Date().toISOString(),
      stageResults: {},
    };

    if (fs.existsSync(cachePath)) {
      try {
        cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      } catch {}
    }

    cache.lastBuildTime = new Date().toISOString();
    cache.stageResults[stage] = {
      status,
      outputs: this.nodes.get(stage)?.outputs || [],
    };

    for (const src of sources) {
      const fullPath = path.join(projectDir, src);
      if (fs.existsSync(fullPath)) {
        cache.hashes[src] = this.computeHash(fullPath);
      }
    }

    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
  }

  private computeHash(filePath: string): string {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}
