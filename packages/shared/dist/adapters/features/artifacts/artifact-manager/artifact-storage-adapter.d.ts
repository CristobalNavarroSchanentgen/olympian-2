import { Artifact } from '../../../../models/artifacts/index';
/**
 * Artifact storage adapter for artifact management
 * Transforms storage operations for artifact-manager feature
 */
export interface ArtifactStorageAdapter {
    storeArtifact(artifact: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artifact>;
    retrieveArtifact(id: string): Promise<Artifact | null>;
    updateArtifact(id: string, updates: Partial<Artifact>): Promise<Artifact>;
    deleteArtifact(id: string): Promise<void>;
    searchArtifacts(query: string): Promise<Artifact[]>;
    listArtifacts(options: ListOptions): Promise<ArtifactsList>;
    getArtifactsByConversation(conversationId: string): Promise<Artifact[]>;
    getArtifactsByType(type: string): Promise<Artifact[]>;
}
export interface ListOptions {
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'type';
    sortOrder?: 'asc' | 'desc';
    type?: string;
    conversationId?: string;
}
export interface ArtifactsList {
    artifacts: Artifact[];
    total: number;
    hasMore: boolean;
}
export declare function createArtifactStorageAdapter(): ArtifactStorageAdapter;
//# sourceMappingURL=artifact-storage-adapter.d.ts.map