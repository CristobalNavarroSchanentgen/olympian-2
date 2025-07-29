"use strict";
/**
 * Version Tracker Adapter
 * Transforms between artifact version utility and the artifact manager feature
 * Follows AI-Native architecture - stays under 100 lines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVersionTrackerAdapter = createVersionTrackerAdapter;
// Helper functions extracted outside returned object (AI-native pattern)
function getNextVersionNumberHelper(versions, artifactId) {
    const artifactVersions = versions.get(artifactId) || [];
    return artifactVersions.length + 1;
}
function generateContentHashHelper(content) {
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}
/**
 * Adapter for version tracking operations
 * Transforms utility functions into feature-specific interface
 */
function createVersionTrackerAdapter() {
    // In-memory storage for demo - real implementation would use database
    const versions = new Map();
    return {
        async createVersion(artifactId, content, description) {
            const versionNumber = getNextVersionNumberHelper(versions, artifactId);
            const hash = generateContentHashHelper(content);
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
            const artifactVersions = versions.get(artifactId) || [];
            const version = artifactVersions.find(v => v.versionNumber === versionNumber) || null;
            if (!version) {
                throw new Error(`Version ${versionNumber} not found for artifact ${artifactId}`);
            }
            // Create rollback version before restoring
            const rollbackVersionNumber = getNextVersionNumberHelper(versions, artifactId);
            const rollbackHash = generateContentHashHelper(version.content);
            const rollbackVersion = {
                id: `${artifactId}_v${rollbackVersionNumber}`,
                artifactId,
                versionNumber: rollbackVersionNumber,
                content: version.content,
                contentHash: rollbackHash,
                description: "rollback",
                createdAt: new Date(),
                metadata: {
                    size: version.content.length,
                    hash: rollbackHash
                }
            };
            const artifactVersionsForRollback = versions.get(artifactId) || [];
            artifactVersionsForRollback.push(rollbackVersion);
            versions.set(artifactId, artifactVersionsForRollback);
            const restoredArtifact = {
                id: artifactId,
                title: "Restored Artifact",
                type: "code",
                content: version.content,
                conversationId: "",
                messageId: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                metadata: {
                    size: version.content.length,
                    version: version.versionNumber,
                    tags: []
                }
            };
            return restoredArtifact;
        }
    };
}
//# sourceMappingURL=version-tracker-adapter.js.map