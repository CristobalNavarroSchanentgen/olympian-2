/**
 * Feature Implementation: Artifact Manager
 */
import { ArtifactManagerContract, ArtifactManagerDependencies } from "./contract";
import { Artifact } from "../../../models/artifacts/artifact";
import { ArtifactVersion } from "../../../models/artifacts/version";
export declare class ArtifactManager implements ArtifactManagerContract {
    private deps;
    constructor(deps: ArtifactManagerDependencies);
    createArtifact(params: {
        conversationId: string;
        messageId: string;
        type: string;
        title: string;
        content: string;
        language?: string;
        metadata?: Record<string, unknown>;
    }): Promise<Artifact>;
    updateArtifact(artifactId: string, updates: {
        title?: string;
        content?: string;
        metadata?: Record<string, unknown>;
        changeDescription?: string;
    }): Promise<Artifact>;
    getArtifact(artifactId: string): Promise<Artifact | null>;
    deleteArtifact(artifactId: string): Promise<void>;
    listArtifacts(params: {
        conversationId?: string;
        type?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        artifacts: Artifact[];
        total: number;
    }>;
    searchArtifacts(query: string, options?: {
        conversationId?: string;
        type?: string;
        limit?: number;
    }): Promise<Artifact[]>;
    getVersionHistory(artifactId: string): Promise<ArtifactVersion[]>;
    revertToVersion(artifactId: string, version: number): Promise<Artifact>;
    duplicateArtifact(artifactId: string, newTitle?: string): Promise<Artifact>;
    validateArtifact(type: string, content: string, language?: string): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    getArtifactsByConversation(conversationId: string): Promise<Artifact[]>;
    getArtifactsByMessage(messageId: string): Promise<Artifact[]>;
    private generateArtifactId;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map