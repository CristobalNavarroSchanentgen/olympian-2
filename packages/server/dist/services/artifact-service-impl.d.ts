/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { Artifact } from '@olympian/shared/models/artifacts/artifact';
import { ArtifactVersion, ArtifactFilter } from '@olympian/shared/models/artifacts';
export declare class ArtifactServiceImpl implements ArtifactService {
    private artifacts;
    private conversationArtifacts;
    private artifactVersions;
    private nextId;
    private nextVersionId;
    createArtifact(conversationId: string, messageId: string, type: string, title: string, content: string, metadata?: Record<string, unknown>): Promise<Artifact>;
    getArtifact(id: string): Promise<Artifact | null>;
    updateArtifact(id: string, updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>): Promise<Artifact>;
    deleteArtifact(id: string): Promise<boolean>;
    listArtifacts(filter?: ArtifactFilter, limit?: number, offset?: number): Promise<Artifact[]>;
    getConversationArtifacts(conversationId: string): Promise<Artifact[]>;
    getArtifactVersions(artifactId: string): Promise<ArtifactVersion[]>;
    createVersion(artifactId: string, content: string, changes: string): Promise<ArtifactVersion>;
    restoreToVersion(artifactId: string, version: number): Promise<Artifact>;
    validateArtifact(type: string, content: string): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    searchArtifacts(query: string, filter?: ArtifactFilter, limit?: number): Promise<Artifact[]>;
    getArtifactCount(filter?: ArtifactFilter): Promise<number>;
}
