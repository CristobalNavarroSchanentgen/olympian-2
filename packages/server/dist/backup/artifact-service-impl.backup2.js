"use strict";
/**
 * Artifact Service Implementation
 * MongoDB-backed persistence for artifacts with versioning support
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactServiceImpl = void 0;
const artifact_repository_1 = require("../database/artifact-repository");
class ArtifactServiceImpl {
    artifactRepo;
    // Note: Version support would require additional repository for production
    artifactVersions = new Map();
    nextVersionId = 1;
    constructor() {
        this.artifactRepo = new artifact_repository_1.ArtifactRepository();
    }
    async createArtifact(conversationId, messageId, type, title, content, metadata) {
        const now = new Date();
        const artifactData = {
            conversationId,
            messageId,
            title,
            type: type,
            content,
            createdAt: now,
            updatedAt: now,
            metadata: {
                size: content.length,
                version: 1,
                tags: [],
                ...metadata
            }
        };
        return await this.artifactRepo.create(artifactData);
    }
    async getArtifact(id) {
        return await this.artifactRepo.findById(id);
    }
    async updateArtifact(id, updates) {
        const updated = await this.artifactRepo.update(id, {
            ...updates,
            metadata: {
                ...updates.metadata,
                size: updates.content?.length,
                version: updates.metadata?.version || 1
            }
        });
        if (!updated) {
            return false;
        }
        return updated;
    }
    async deleteArtifact(id) {
        const deleted = await this.artifactRepo.delete(id);
        if (!deleted) {
            return false;
        }
        // Clean up versions (in-memory for now)
        this.artifactVersions.delete(id);
    }
    async getConversationArtifacts(conversationId) {
        return await this.artifactRepo.findByConversation(conversationId);
    }
    async getMessageArtifacts(messageId) {
        return await this.artifactRepo.findByMessage(messageId);
    }
    async listArtifacts(filter) {
        return await this.artifactRepo.list(filter);
    }
    // Version management methods (using in-memory storage for now)
    async getArtifactVersions(artifactId) {
        return this.artifactVersions.get(artifactId) || [];
    }
    async createVersion(artifactId, content, changeDescription) {
        const artifact = await this.getArtifact(artifactId);
        if (!artifact) {
            return false;
        }
        const version = {
            id: `v_${this.nextVersionId++}`,
            artifactId,
            version: (this.artifactVersions.get(artifactId)?.length || 0) + 1,
            content,
            createdAt: new Date(),
            changeDescription: changeDescription || 'Version update'
        };
        if (!this.artifactVersions.has(artifactId)) {
            this.artifactVersions.set(artifactId, []);
        }
        this.artifactVersions.get(artifactId).push(version);
        return version;
    }
    async restoreToVersion(artifactId, versionId) {
        const versions = this.artifactVersions.get(artifactId) || [];
        const version = versions.find(v => v.id === versionId);
        if (!version) {
            throw new Error(`Version ${versionId} not found for artifact ${artifactId}`);
        }
        return await this.updateArtifact(artifactId, {
            content: version.content,
            metadata: { version: version.version, restored: true }
        });
    }
    async validateArtifact(artifactId) {
        const artifact = await this.getArtifact(artifactId);
        if (!artifact) {
            return { valid: false, errors: ['Artifact not found'] };
        }
        const errors = [];
        if (!artifact.title?.trim()) {
            errors.push('Title is required');
        }
        if (!artifact.content?.trim()) {
            errors.push('Content is required');
        }
        if (artifact.content && artifact.content.length > 1000000) {
            errors.push('Content exceeds maximum size (1MB)');
        }
        return { valid: errors.length === 0, errors };
    }
    async searchArtifacts(query, filter) {
        return await this.artifactRepo.search(query, filter);
    }
    async getArtifactCount(filter) {
        return await this.artifactRepo.count(filter);
    }
}
exports.ArtifactServiceImpl = ArtifactServiceImpl;
//# sourceMappingURL=artifact-service-impl.backup2.js.map