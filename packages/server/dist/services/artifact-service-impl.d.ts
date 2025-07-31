/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { Artifact } from '@olympian/shared/models/artifacts/artifact';
export declare class ArtifactServiceImpl implements ArtifactService {
    private artifacts;
    private conversationArtifacts;
    private nextId;
    createArtifact(conversationId: string, messageId: string, type: string, title: string, content: string, metadata?: Record<string, unknown>): Promise<Artifact>;
    getArtifact(id: string): Promise<Artifact | null>;
    updateArtifact(id: string, updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>): Promise<Artifact>;
    deleteArtifact(id: string): Promise<boolean>;
    getConversationArtifacts(conversationId: string): Promise<Artifact[]>;
}
