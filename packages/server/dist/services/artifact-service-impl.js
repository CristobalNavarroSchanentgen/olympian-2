"use strict";
/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactServiceImpl = void 0;
class ArtifactServiceImpl {
    artifacts = new Map();
    conversationArtifacts = new Map();
    nextId = 1;
    async createArtifact(conversationId, messageId, type, title, content, metadata) {
        const id = `art_${this.nextId++}`;
        const now = new Date();
        const artifact = {
            id,
            conversationId,
            title,
            type,
            content,
            createdAt: now,
            updatedAt: now,
            metadata: metadata || {}
        };
        this.artifacts.set(id, artifact);
        // Track artifact in conversation
        if (!this.conversationArtifacts.has(conversationId)) {
            this.conversationArtifacts.set(conversationId, []);
        }
        this.conversationArtifacts.get(conversationId).push(id);
        return artifact;
    }
    async getArtifact(id) {
        return this.artifacts.get(id) || null;
    }
    async updateArtifact(id, updates) {
        const artifact = this.artifacts.get(id);
        if (!artifact) {
            throw new Error(`Artifact ${id} not found`);
        }
        const updated = {
            ...artifact,
            ...updates,
            updatedAt: new Date()
        };
        this.artifacts.set(id, updated);
        return updated;
    }
    async deleteArtifact(id) {
        const artifact = this.artifacts.get(id);
        if (!artifact) {
            throw new Error(`Artifact ${id} not found`);
        }
        // Remove from conversation tracking
        const conversationId = artifact.conversationId;
        const artifactIds = this.conversationArtifacts.get(conversationId) || [];
        const updatedIds = artifactIds.filter(artId => artId !== id);
        this.conversationArtifacts.set(conversationId, updatedIds);
        // Remove the artifact
        return this.artifacts.delete(id);
    }
    async getConversationArtifacts(conversationId) {
        const artifactIds = this.conversationArtifacts.get(conversationId) || [];
        const artifacts = artifactIds
            .map(id => this.artifacts.get(id))
            .filter((art) => art !== undefined);
        // Sort by creation time
        return artifacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
}
exports.ArtifactServiceImpl = ArtifactServiceImpl;
//# sourceMappingURL=artifact-service-impl.js.map