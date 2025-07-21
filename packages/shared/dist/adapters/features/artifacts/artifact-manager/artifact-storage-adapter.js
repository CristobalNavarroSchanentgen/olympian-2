"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtifactStorageAdapter = createArtifactStorageAdapter;
const artifact_validator_1 = require("../../../utils/artifact-validator");
// In-memory storage for demo purposes
// In production, this would connect to a database
const artifactStore = new Map();
function createArtifactStorageAdapter() {
    return {
        async storeArtifact(artifactData) {
            // Validate artifact before storing
            const validation = (0, artifact_validator_1.validateArtifact)(artifactData.content, artifactData.type);
            if (!validation.valid) {
                throw new Error(`Artifact validation failed: ${validation.errors.join(', ')}`);
            }
            const now = new Date();
            const artifact = {
                ...artifactData,
                id: this.generateArtifactId(),
                createdAt: now,
                updatedAt: now,
                metadata: {
                    ...artifactData.metadata,
                    validationResult: validation,
                    storageVersion: '1.0.0'
                }
            };
            artifactStore.set(artifact.id, artifact);
            return artifact;
        },
        async retrieveArtifact(id) {
            const artifact = artifactStore.get(id);
            return artifact || null;
        },
        async updateArtifact(id, updates) {
            const existing = artifactStore.get(id);
            if (!existing) {
                throw new Error(`Artifact ${id} not found`);
            }
            // Validate content if it's being updated
            if (updates.content) {
                const validation = (0, artifact_validator_1.validateArtifact)(updates.content, updates.type || existing.type);
                if (!validation.valid) {
                    throw new Error(`Artifact validation failed: ${validation.errors.join(', ')}`);
                }
                updates.metadata = {
                    ...existing.metadata,
                    ...updates.metadata,
                    validationResult: validation
                };
            }
            const updated = {
                ...existing,
                ...updates,
                updatedAt: new Date()
            };
            artifactStore.set(id, updated);
            return updated;
        },
        async deleteArtifact(id) {
            const exists = artifactStore.has(id);
            if (!exists) {
                throw new Error(`Artifact ${id} not found`);
            }
            artifactStore.delete(id);
        },
        async searchArtifacts(query) {
            const results = [];
            const searchTerm = query.toLowerCase();
            for (const artifact of artifactStore.values()) {
                if (artifact.title.toLowerCase().includes(searchTerm) ||
                    artifact.description?.toLowerCase().includes(searchTerm) ||
                    artifact.content.toLowerCase().includes(searchTerm) ||
                    artifact.type.toLowerCase().includes(searchTerm)) {
                    results.push(artifact);
                }
            }
            return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        },
        async listArtifacts(options = {}) {
            let artifacts = Array.from(artifactStore.values());
            // Apply filters
            if (options.type) {
                artifacts = artifacts.filter(a => a.type === options.type);
            }
            if (options.conversationId) {
                artifacts = artifacts.filter(a => a.conversationId === options.conversationId);
            }
            // Apply sorting
            const sortBy = options.sortBy || 'updatedAt';
            const sortOrder = options.sortOrder || 'desc';
            artifacts.sort((a, b) => {
                let aValue, bValue;
                switch (sortBy) {
                    case 'title':
                        aValue = a.title;
                        bValue = b.title;
                        break;
                    case 'type':
                        aValue = a.type;
                        bValue = b.type;
                        break;
                    case 'createdAt':
                        aValue = a.createdAt.getTime();
                        bValue = b.createdAt.getTime();
                        break;
                    case 'updatedAt':
                    default:
                        aValue = a.updatedAt.getTime();
                        bValue = b.updatedAt.getTime();
                        break;
                }
                if (sortOrder === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                }
                else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });
            // Apply pagination
            const total = artifacts.length;
            const limit = options.limit || 50;
            const offset = options.offset || 0;
            const paginatedArtifacts = artifacts.slice(offset, offset + limit);
            const hasMore = offset + limit < total;
            return {
                artifacts: paginatedArtifacts,
                total,
                hasMore
            };
        },
        async getArtifactsByConversation(conversationId) {
            const artifacts = Array.from(artifactStore.values())
                .filter(a => a.conversationId === conversationId)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            return artifacts;
        },
        async getArtifactsByType(type) {
            const artifacts = Array.from(artifactStore.values())
                .filter(a => a.type === type)
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
            return artifacts;
        },
        // Helper methods
        generateArtifactId() {
            return `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
    };
}
//# sourceMappingURL=artifact-storage-adapter.js.map