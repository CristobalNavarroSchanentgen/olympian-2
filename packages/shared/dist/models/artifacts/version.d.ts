/**
 * Version Model
 * Represents an artifact version in the system
 */
export interface Version {
    id: string;
    artifactId: string;
    versionNumber: number;
    content: string;
    contentHash: string;
    description: string;
    createdAt: Date;
    metadata: Record<string, unknown>;
}
export interface VersionMetadata {
    size: number;
    hash: string;
    author?: string;
    changes?: string[];
}
export type ArtifactVersion = Version;
//# sourceMappingURL=version.d.ts.map