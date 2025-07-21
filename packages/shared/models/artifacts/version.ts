/**
 * Artifact version model - pure types only
 */

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly label?: string;
}

export interface VersionHistory {
  readonly artifactId: string;
  readonly versions: ArtifactVersion[];
  readonly currentVersion: number;
  readonly totalVersions: number;
}

export interface VersionDiff {
  readonly oldVersion: number;
  readonly newVersion: number;
  readonly additions: number;
  readonly deletions: number;
  readonly changes: DiffChange[];
}

export interface DiffChange {
  readonly type: 'add' | 'remove' | 'modify';
  readonly line: number;
  readonly content: string;
  readonly oldContent?: string;
}

export interface VersionStats {
  readonly artifactId: string;
  readonly totalVersions: number;
  readonly averageSize: number;
  readonly creationFrequency: number;
  readonly lastModified: Date;
}
