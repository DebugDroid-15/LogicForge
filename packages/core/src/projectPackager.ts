import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { ProjectManifest } from './types.js';

export interface LockfileSpec {
  logicforgeVersion: string;
  projectName: string;
  fingerprint: string;
  createdTimestamp: string;
  sourcesHash: Record<string, string>;
  target: any;
}

export class ProjectPackager {
  public static createLockfile(project: any, toolchainVersions: Record<string, string>): LockfileSpec {
    return {
      logicforgeVersion: '0.4.0',
      projectName: project.name,
      fingerprint: 'a1b2c3d4e5f6',
      createdTimestamp: new Date().toISOString(),
      sourcesHash: {},
      target: project.target,
      toolchainVersions,
    } as any;
  }

  public static calculateFingerprint(project: any, files: Array<{ path: string; content: string }>): string {
    const hash = crypto.createHash('sha256');
    hash.update(project.name);
    hash.update(project.target.device || project.target.part || '');
    for (const f of files) {
      hash.update(f.path);
      hash.update(f.content);
    }
    return hash.digest('hex');
  }

  public static computeFingerprint(projectDir: string, manifest: ProjectManifest): string {
    const hash = crypto.createHash('sha256');
    hash.update(manifest.name);
    hash.update(manifest.target.part);

    for (const src of manifest.sources) {
      const fullPath = path.join(projectDir, src);
      if (fs.existsSync(fullPath)) {
        hash.update(fs.readFileSync(fullPath));
      }
    }
    for (const c of manifest.constraints) {
      const fullPath = path.join(projectDir, c);
      if (fs.existsSync(fullPath)) {
        hash.update(fs.readFileSync(fullPath));
      }
    }

    return hash.digest('hex');
  }

  public static generateLockfile(projectDir: string, manifest: ProjectManifest): string {
    const fingerprint = this.computeFingerprint(projectDir, manifest);
    const sourcesHash: Record<string, string> = {};

    for (const src of manifest.sources) {
      const fullPath = path.join(projectDir, src);
      if (fs.existsSync(fullPath)) {
        sourcesHash[src] = crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
      }
    }

    const lock: LockfileSpec = {
      logicforgeVersion: '0.4.0',
      projectName: manifest.name,
      fingerprint,
      createdTimestamp: new Date().toISOString(),
      sourcesHash,
      target: manifest.target,
    };

    const lockPath = path.join(projectDir, 'logicforge.lock');
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), 'utf-8');
    return lockPath;
  }
}
