/**
 * Artifact Repository - MongoDB Operations
 * Handles all artifact database operations
 */
import { Artifact, ArtifactType } from '@olympian/shared/models/artifacts/artifact';
import { ArtifactFilter } from '@olympian/shared/models/artifacts';
export declare class ArtifactRepository {
    private getCollection;
    create(artifact: Omit<Artifact, 'id'>): Promise<Artifact>;
    findById(id: string): Promise<Artifact | null>;
    update(id: string, updates: Partial<Omit<Artifact, 'id' | 'createdAt'>>): Promise<Artifact | null>;
    delete(id: string): Promise<boolean>;
    findByConversation(conversationId: string): Promise<Artifact[]>;
    findByMessage(messageId: string): Promise<Artifact[]>;
    list(filter?: ArtifactFilter): Promise<Artifact[]>;
    search(query: string, filter?: ArtifactFilter): Promise<Artifact[]>;
    count(filter?: ArtifactFilter): Promise<number>;
    deleteByConversation(conversationId: string): Promise<number>;
    getByType(type: ArtifactType, limit?: number): Promise<Artifact[]>;
}
