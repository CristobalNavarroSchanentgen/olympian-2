/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
export class ArtifactServiceImpl {
    artifacts = new Map();
    conversationArtifacts = new Map();
    artifactVersions = new Map();
    nextId = 1;
    nextVersionId = 1;
    async createArtifact(conversationId, messageId, type, title, content, metadata) {
        const id = `art_${this.nextId++}`;
        const now = new Date();
        const artifact = {
            id,
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
            updatedAt: new Date(),
            metadata: {
                ...artifact.metadata,
                ...updates.metadata,
                size: updates.content ? updates.content.length : artifact.metadata.size
            }
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
        // Remove artifact versions
        this.artifactVersions.delete(id);
        // Remove the artifact
        return this.artifacts.delete(id);
    }
    async listArtifacts(filter, limit, offset) {
        let artifacts = Array.from(this.artifacts.values());
        // Apply filters
        if (filter) {
            if (filter.type) {
                artifacts = artifacts.filter(art => art.type === filter.type);
            }
            if (filter.conversationId) {
                artifacts = artifacts.filter(art => art.conversationId === filter.conversationId);
            }
            if (filter.createdAfter) {
                artifacts = artifacts.filter(art => art.createdAt >= filter.createdAfter);
            }
            if (filter.createdBefore) {
                artifacts = artifacts.filter(art => art.createdAt <= filter.createdBefore);
            }
            if (filter.tags && filter.tags.length > 0) {
                artifacts = artifacts.filter(art => filter.tags.some(tag => art.metadata.tags?.includes(tag)));
            }
        }
        // Sort by creation time (newest first)
        artifacts = artifacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // Apply pagination
        const start = offset || 0;
        const end = limit ? start + limit : undefined;
        return artifacts.slice(start, end);
    }
    async getConversationArtifacts(conversationId) {
        const artifactIds = this.conversationArtifacts.get(conversationId) || [];
        const artifacts = artifactIds
            .map(id => this.artifacts.get(id))
            .filter((art) => art !== undefined);
        // Sort by creation time
        return artifacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    async getArtifactVersions(artifactId) {
        return this.artifactVersions.get(artifactId) || [];
    }
    async createVersion(artifactId, content, changes) {
        const artifact = this.artifacts.get(artifactId);
        if (!artifact) {
            throw new Error(`Artifact ${artifactId} not found`);
        }
        const versions = this.artifactVersions.get(artifactId) || [];
        const versionNumber = versions.length + 1;
        const versionId = `ver_${this.nextVersionId++}`;
        const version = {
            id: versionId,
            artifactId,
            versionNumber,
            content,
            contentHash: Buffer.from(content).toString('base64').substring(0, 16),
            description: changes,
            createdAt: new Date(),
            metadata: { changes, size: content.length }
        };
        versions.push(version);
        this.artifactVersions.set(artifactId, versions);
        return version;
    }
    async restoreToVersion(artifactId, version) {
        const versions = this.artifactVersions.get(artifactId) || [];
        const targetVersion = versions.find(v => v.versionNumber === version);
        if (!targetVersion) {
            throw new Error(`Version ${version} not found for artifact ${artifactId}`);
        }
        const updated = await this.updateArtifact(artifactId, {
            content: targetVersion.content
        });
        return updated;
    }
    async validateArtifact(type, content) {
        const errors = [];
        const warnings = [];
        // Basic validation
        if (!content.trim()) {
            errors.push('Content cannot be empty');
        }
        // Type-specific validation
        switch (type) {
            case 'code':
                if (content.length > 50000) {
                    warnings.push('Code content is very large');
                }
                break;
            case 'html':
                if (!content.includes('<html') && !content.includes('<!DOCTYPE')) {
                    warnings.push('HTML content might be missing DOCTYPE or html tag');
                }
                break;
            case 'react':
                if (!content.includes('export') && !content.includes('function')) {
                    warnings.push('React component might be missing export or function definition');
                }
                break;
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    async searchArtifacts(query, filter, limit) {
        const searchTerm = query.toLowerCase();
        let artifacts = Array.from(this.artifacts.values());
        // Apply text search
        artifacts = artifacts.filter(art => art.title.toLowerCase().includes(searchTerm) ||
            art.content.toLowerCase().includes(searchTerm) ||
            art.type.toLowerCase().includes(searchTerm));
        // Apply additional filters
        if (filter) {
            if (filter.type) {
                artifacts = artifacts.filter(art => art.type === filter.type);
            }
            if (filter.conversationId) {
                artifacts = artifacts.filter(art => art.conversationId === filter.conversationId);
            }
            if (filter.tags && filter.tags.length > 0) {
                artifacts = artifacts.filter(art => filter.tags.some(tag => art.metadata.tags?.includes(tag)));
            }
        }
        // Sort by relevance (title matches first, then content matches)
        artifacts = artifacts.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(searchTerm);
            const bTitle = b.title.toLowerCase().includes(searchTerm);
            if (aTitle && !bTitle)
                return -1;
            if (!aTitle && bTitle)
                return 1;
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return limit ? artifacts.slice(0, limit) : artifacts;
    }
    async getArtifactCount(filter) {
        const artifacts = await this.listArtifacts(filter);
        return artifacts.length;
    }
}
//# sourceMappingURL=artifact-service-impl.js.map