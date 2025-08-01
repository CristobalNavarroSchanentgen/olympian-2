/**
 * Artifact-related events
 */
export interface ArtifactCreated {
    readonly type: 'artifact-created';
    readonly artifactId: string;
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface ArtifactUpdated {
    readonly type: 'artifact-updated';
    readonly artifactId: string;
    readonly version: number;
    readonly timestamp: Date;
}
export interface ArtifactDeleted {
    readonly type: 'artifact-deleted';
    readonly artifactId: string;
    readonly timestamp: Date;
}
