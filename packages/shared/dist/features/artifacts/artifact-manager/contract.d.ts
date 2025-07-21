/**
 * Feature Contract: Artifact Manager
 *
 * Manages creation, versioning, and lifecycle of conversation artifacts.
 */
import { Artifact, Version } from '../../../models/artifacts';
import { ArtifactService } from '../../../services/artifact-service';
import { ArtifactCreated, ArtifactUpdated, ArtifactDeleted } from '../../../events';
import { ArtifactManagerConfig } from '../../../config/features/artifacts/artifact-manager/schema';
export interface ArtifactManagerContract {
    /**
     * Create new artifact with content validation
     */
    createArtifact(params: {
        conversationId: string;
        messageId: string;
        type: string;
        content: string;
        metadata?: Record<string, unknown>;
        title?: string;
    }): Promise<{
        artifact: Artifact;
        validation: {
            isValid: boolean;
            warnings: string[];
            suggestions: string[];
        };
    }>;
    /**
     * Create multiple artifacts in batch
     */
    createArtifacts(artifacts: Array<{
        conversationId: string;
        messageId: string;
        type: string;
        content: string;
        metadata?: Record<string, unknown>;
        title?: string;
    }>): Promise<{
        created: Artifact[];
        failed: Array<{
            index: number;
            error: string;
        }>;
        duplicates: Array<{
            index: number;
            existingId: string;
        }>;
    }>;
    /**
     * Get artifact by ID with version history
     */
    getArtifact(artifactId: string, options?: {
        includeVersions?: boolean;
        includeContent?: boolean;
    }): Promise<{
        artifact: Artifact;
        versions?: Version[];
        currentVersion: number;
    } | null>;
    /**
     * Update artifact content and create new version
     */
    updateArtifact(params: {
        artifactId: string;
        content: string;
        changeDescription?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        artifact: Artifact;
        newVersion: Version;
        contentChanged: boolean;
    }>;
    /**
     * Delete artifact and all versions
     */
    deleteArtifact(artifactId: string): Promise<void>;
    /**
     * Get specific version of artifact
     */
    getVersion(artifactId: string, versionNumber: number): Promise<Version | null>;
    /**
     * Revert artifact to previous version
     */
    revertToVersion(artifactId: string, versionNumber: number): Promise<{
        artifact: Artifact;
        newVersion: Version;
        revertedFrom: number;
    }>;
    /**
     * Compare two versions of artifact
     */
    compareVersions(artifactId: string, version1: number, version2: number): Promise<{
        differences: Array<{
            type: 'addition' | 'deletion' | 'modification';
            line: number;
            content: string;
        }>;
        similarity: number;
        changesSummary: string;
    }>;
    /**
     * Compress old versions to save space
     */
    compressVersions(artifactId: string, keepRecent?: number): Promise<{
        versionsCompressed: number;
        spaceSaved: number;
        versionsRetained: number;
    }>;
    /**
     * Validate artifact content by type
     */
    validateContent(type: string, content: string): Promise<{
        isValid: boolean;
        errors: Array<{
            line?: number;
            column?: number;
            message: string;
            severity: 'error' | 'warning' | 'info';
        }>;
        suggestions: string[];
        quality: {
            score: number;
            metrics: Record<string, number>;
        };
    }>;
    /**
     * Detect duplicate or similar artifacts
     */
    detectDuplicates(params: {
        content: string;
        type: string;
        conversationId?: string;
        threshold?: number;
    }): Promise<{
        duplicates: Array<{
            artifactId: string;
            similarity: number;
            title: string;
            createdAt: Date;
        }>;
        nearDuplicates: Array<{
            artifactId: string;
            similarity: number;
            differences: string[];
        }>;
    }>;
    /**
     * Search artifacts by content or metadata
     */
    searchArtifacts(params: {
        query: string;
        type?: string;
        conversationId?: string;
        limit?: number;
        sortBy?: 'relevance' | 'created' | 'updated';
    }): Promise<{
        artifacts: Array<{
            artifact: Artifact;
            relevance: number;
            highlights: string[];
        }>;
        totalFound: number;
        searchTime: number;
    }>;
    /**
     * List artifacts by conversation
     */
    getConversationArtifacts(conversationId: string, options?: {
        type?: string;
        includeVersions?: boolean;
        sortBy?: 'created' | 'updated' | 'type';
    }): Promise<Artifact[]>;
    /**
     * Export artifact with all versions
     */
    exportArtifact(artifactId: string, format?: 'json' | 'zip'): Promise<{
        data: string | Buffer;
        filename: string;
        size: number;
    }>;
    /**
     * Import artifact from external data
     */
    importArtifact(data: string | Buffer, params: {
        conversationId: string;
        messageId: string;
        preserveVersions?: boolean;
    }): Promise<{
        artifact: Artifact;
        versionsImported: number;
        warnings: string[];
    }>;
    /**
     * Get artifact usage statistics
     */
    getStatistics(scope?: {
        conversationId?: string;
        timeRange?: {
            start: Date;
            end: Date;
        };
    }): Promise<{
        totalArtifacts: number;
        artifactsByType: Record<string, number>;
        totalVersions: number;
        averageVersionsPerArtifact: number;
        storageUsed: number;
        mostActiveConversations: Array<{
            conversationId: string;
            artifactCount: number;
        }>;
    }>;
    updateConfig(config: Partial<ArtifactManagerConfig>): Promise<void>;
    getConfig(): ArtifactManagerConfig;
}
export interface ArtifactStorageAdapter {
    store(artifact: Artifact): Promise<string>;
    retrieve(artifactId: string): Promise<Artifact | null>;
    update(artifactId: string, updates: Partial<Artifact>): Promise<Artifact>;
    delete(artifactId: string): Promise<void>;
    search(query: string, filters?: Record<string, unknown>): Promise<Artifact[]>;
}
export interface VersionTrackerAdapter {
    createVersion(artifactId: string, content: string, metadata?: Record<string, unknown>): Promise<Version>;
    getVersion(artifactId: string, versionNumber: number): Promise<Version | null>;
    listVersions(artifactId: string): Promise<Version[]>;
    deleteVersion(artifactId: string, versionNumber: number): Promise<void>;
    compareVersions(version1: Version, version2: Version): Promise<{
        differences: unknown[];
        similarity: number;
    }>;
}
export interface ArtifactEventPublisher {
    publishArtifactCreated(event: ArtifactCreated): void;
    publishArtifactUpdated(event: ArtifactUpdated): void;
    publishArtifactDeleted(event: ArtifactDeleted): void;
}
export interface ArtifactManagerDependencies {
    artifactService: ArtifactService;
    artifactStorageAdapter: ArtifactStorageAdapter;
    versionTrackerAdapter: VersionTrackerAdapter;
    eventPublisher: ArtifactEventPublisher;
    config: ArtifactManagerConfig;
}
//# sourceMappingURL=contract.d.ts.map