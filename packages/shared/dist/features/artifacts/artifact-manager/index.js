"use strict";
/**
 * Feature Implementation: Artifact Manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactManager = void 0;
class ArtifactManager {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async createArtifact(params) {
        // Validate content
        const validation = this.deps.artifactValidator.validate({
            type: params.type,
            content: params.content,
            language: params.language
        });
        if (!validation.valid) {
            throw new Error(`Invalid artifact: ${validation.errors.join(", ")}`);
        }
        const artifact = {
            id: this.generateArtifactId(),
            conversationId: params.conversationId,
            messageId: params.messageId,
            type: params.type,
            title: params.title,
            content: params.content,
            language: params.language,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            metadata: params.metadata || {}
        };
        const saved = await this.deps.artifactStorage.save(artifact);
        // Create initial version
        await this.deps.versionTracker.createVersion({
            artifactId: saved.id,
            version: 1,
            content: saved.content,
            changeDescription: "Initial creation"
        });
        this.deps.eventPublisher.publishArtifactCreated({
            artifactId: saved.id,
            conversationId: saved.conversationId,
            type: saved.type,
            title: saved.title,
            timestamp: new Date()
        });
        return saved;
    }
    async updateArtifact(artifactId, updates) {
        const existing = await this.deps.artifactStorage.findById(artifactId);
        if (!existing) {
            throw new Error(`Artifact not found: ${artifactId}`);
        }
        // Validate updated content if provided
        if (updates.content) {
            const validation = this.deps.artifactValidator.validate({
                type: existing.type,
                content: updates.content,
                language: existing.language
            });
            if (!validation.valid) {
                throw new Error(`Invalid artifact update: ${validation.errors.join(", ")}`);
            }
        }
        const updated = {
            ...existing,
            ...updates,
            version: existing.version + 1,
            updatedAt: new Date()
        };
        const saved = await this.deps.artifactStorage.update(artifactId, updated);
        // Create new version if content changed
        if (updates.content && updates.content !== existing.content) {
            await this.deps.versionTracker.createVersion({
                artifactId,
                version: saved.version,
                content: saved.content,
                changeDescription: updates.changeDescription || "Content updated"
            });
        }
        this.deps.eventPublisher.publishArtifactUpdated({
            artifactId: saved.id,
            conversationId: saved.conversationId,
            changes: Object.keys(updates),
            timestamp: new Date()
        });
        return saved;
    }
    async getArtifact(artifactId) {
        return await this.deps.artifactStorage.findById(artifactId);
    }
    async deleteArtifact(artifactId) {
        const artifact = await this.getArtifact(artifactId);
        if (!artifact) {
            throw new Error(`Artifact not found: ${artifactId}`);
        }
        await this.deps.artifactStorage.delete(artifactId);
        await this.deps.versionTracker.deleteVersions(artifactId);
        this.deps.eventPublisher.publishArtifactDeleted({
            artifactId,
            conversationId: artifact.conversationId,
            timestamp: new Date()
        });
    }
    async listArtifacts(params) {
        return await this.deps.artifactStorage.list({
            conversationId: params.conversationId,
            type: params.type,
            limit: params.limit || 50,
            offset: params.offset || 0
        });
    }
    async searchArtifacts(query, options) {
        return await this.deps.artifactStorage.search({
            query,
            conversationId: options?.conversationId,
            type: options?.type,
            limit: options?.limit || 50
        });
    }
    async getVersionHistory(artifactId) {
        return await this.deps.versionTracker.getVersions(artifactId);
    }
    async revertToVersion(artifactId, version) {
        const targetVersion = await this.deps.versionTracker.getVersion(artifactId, version);
        if (!targetVersion) {
            throw new Error(`Version ${version} not found for artifact ${artifactId}`);
        }
        return await this.updateArtifact(artifactId, {
            content: targetVersion.content,
            changeDescription: `Reverted to version ${version}`
        });
    }
    async duplicateArtifact(artifactId, newTitle) {
        const original = await this.getArtifact(artifactId);
        if (!original) {
            throw new Error(`Artifact not found: ${artifactId}`);
        }
        return await this.createArtifact({
            conversationId: original.conversationId,
            messageId: original.messageId,
            type: original.type,
            title: newTitle || `${original.title} (Copy)`,
            content: original.content,
            language: original.language,
            metadata: { ...original.metadata, duplicatedFrom: artifactId }
        });
    }
    async validateArtifact(type, content, language) {
        const validation = this.deps.artifactValidator.validate({
            type,
            content,
            language
        });
        return {
            valid: validation.valid,
            errors: validation.errors || [],
            warnings: validation.warnings || []
        };
    }
    async getArtifactsByConversation(conversationId) {
        const result = await this.listArtifacts({
            conversationId,
            limit: 1000
        });
        return result.artifacts;
    }
    async getArtifactsByMessage(messageId) {
        return await this.deps.artifactStorage.findByMessage(messageId);
    }
    generateArtifactId() {
        return `art-${Date.now()}-${Math.random().toString(36).substr(2)}`;
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.ArtifactManager = ArtifactManager;
//# sourceMappingURL=index.js.map