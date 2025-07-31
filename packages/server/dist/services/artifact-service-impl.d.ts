/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
import { ArtifactService } from '../../../shared/services/artifact-service';
import { Artifact, ArtifactType } from '../../../shared/models/chat/artifact';
export declare class ArtifactServiceImpl implements ArtifactService {
    private artifacts;
    private conversationArtifacts;
    private nextId;
    createArtifact(conversationId: string, title: string, type: ArtifactType, content: string, metadata?: Record<string, unknown>): Promise<Artifact>;
    getArtifact(id: string): Promise<Artifact | null>;
    updateArtifact(id: string, updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>): Promise<Artifact>;
    deleteArtifact(id: string): Promise<void>;
    getConversationArtifacts(conversationId: string): Promise<Artifact[]>;
}
