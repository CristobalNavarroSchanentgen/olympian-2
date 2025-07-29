/**
 * Version Tracker Adapter
 * Transforms between artifact version utility and the artifact manager feature
 * Follows AI-Native architecture - stays under 100 lines
 */
import type { Artifact } from "../../../../models/artifacts/artifact";
import type { Version } from "../../../../models/artifacts/version";
/**
 * Adapter for version tracking operations
 * Transforms utility functions into feature-specific interface
 */
export declare function createVersionTrackerAdapter(): {
    createVersion(artifactId: string, content: string, description?: string): Promise<Version>;
    getVersions(artifactId: string): Promise<Version[]>;
    getVersion(artifactId: string, versionNumber: number): Promise<Version | null>;
    deleteVersion(artifactId: string, versionNumber: number): Promise<boolean>;
    restoreVersion(artifactId: string, versionNumber: number): Promise<Artifact>;
};
//# sourceMappingURL=version-tracker-adapter.d.ts.map