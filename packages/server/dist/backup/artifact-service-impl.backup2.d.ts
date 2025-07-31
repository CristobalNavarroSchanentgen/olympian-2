/**
 * Artifact Service Implementation
 * MongoDB-backed persistence for artifacts with versioning support
 */
import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { Artifact } from '@olympian/shared/models/artifacts/artifact';
import { ArtifactVersion, ArtifactFilter } from '@olympian/shared/models/artifacts';
export declare class ArtifactServiceImpl implements ArtifactService {
    private artifactRepo;
    private artifactVersions;
    private nextVersionId;
    constructor();
    createArtifact(conversationId: string, messageId: string, type: string, title: string, content: string, metadata?: Record<string, unknown>): Promise<Artifact>;
    getArtifact(id: string): Promise<Artifact | null>;
    updateArtifact(id: string, updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>): Promise<Artifact>;
    deleteArtifact(id: string): Promise<boolean>;
    getConversationArtifacts(conversationId: string): Promise<Artifact[]>;
    getMessageArtifacts(messageId: string): Promise<Artifact[]>;
    listArtifacts(filter?: ArtifactFilter): Promise<Artifact[]>;
    getArtifactVersions(artifactId: string): Promise<ArtifactVersion[]>;
    createVersion(artifactId: string, content: string, changeDescription?: string): Promise<ArtifactVersion>;
    restoreToVersion(artifactId: string, versionId: string): Promise<Artifact>;
    validateArtifact(artifactId: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    searchArtifacts(query: string, filter?: ArtifactFilter): Promise<Artifact[]>;
    getArtifactCount(filter?: ArtifactFilter): Promise<number>;
}
