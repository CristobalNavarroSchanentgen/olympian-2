"use strict";
/**
 * Version Tracker Adapter
 * Transforms between artifact version utility and the artifact manager feature
 * Follows AI-Native architecture - stays under 100 lines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVersionTrackerAdapter = createVersionTrackerAdapter;
/**
 * Adapter for version tracking operations
 * Transforms utility functions into feature-specific interface
 */
function createVersionTrackerAdapter() {
    // In-memory storage for demo - real implementation would use database
    const versions = new Map();
    return {
        async createVersion(artifactId, content, description) {
            const versionNumber = this.getNextVersionNumber(artifactId);
            const hash = this.generateContentHash(content);
            const version = {
                id: `${artifactId}_v${versionNumber}`,
                artifactId,
                versionNumber,
                content,
                contentHash: hash,
                description: description || `Version ${versionNumber}`,
                createdAt: new Date(),
                metadata: {
                    size: content.length,
                    hash
                }
            };
            const artifactVersions = versions.get(artifactId) || [];
            artifactVersions.push(version);
            versions.set(artifactId, artifactVersions);
            return version;
        },
        async getVersions(artifactId) {
            return versions.get(artifactId) || [];
        },
        async getVersion(artifactId, versionNumber) {
            const artifactVersions = versions.get(artifactId) || [];
            return artifactVersions.find(v => v.versionNumber === versionNumber) || null;
        },
        async deleteVersion(artifactId, versionNumber) {
            const artifactVersions = versions.get(artifactId) || [];
            const index = artifactVersions.findIndex(v => v.versionNumber === versionNumber);
            if (index === -1)
                return false;
            artifactVersions.splice(index, 1);
            versions.set(artifactId, artifactVersions);
            return true;
        },
        async restoreVersion(artifactId, versionNumber) {
            const version = await this.getVersion(artifactId, versionNumber);
            if (!version) {
                throw new Error(`Version ${versionNumber} not found for artifact ${artifactId}`);
            }
            // Create rollback version before restoring
            await this.createVersion(artifactId, version.content, 'rollback');
            const restoredArtifact = {
                id: artifactId,
                title: 'Restored Artifact',
                type: 'code',
                content: version.content,
                conversationId: '',
                messageId: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: {}
            };
            return restoredArtifact;
        },
        getNextVersionNumber(artifactId) {
            const artifactVersions = versions.get(artifactId) || [];
            return artifactVersions.length + 1;
        },
        generateContentHash(content) {
            // Simple hash function for demo purposes
            let hash = 0;
            for (let i = 0; i < content.length; i++) {
                const char = content.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString(36);
        }
    };
}
//# sourceMappingURL=version-tracker-adapter.js.map