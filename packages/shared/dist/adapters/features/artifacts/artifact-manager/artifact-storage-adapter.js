import { validateArtifact } from '../../../../utils/artifact-validator';
// Helper functions extracted outside returned object (AI-native pattern)
function generateArtifactId() {
    return `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function validateArtifactHelper(artifactData) {
    const validation = validateArtifact(artifactData);
    if (!validation.isValid) {
        throw new Error(`Artifact validation failed: ${validation.errors.join(', ')}`);
    }
}
function searchArtifactsHelper(artifacts, query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    for (const artifact of artifacts.values()) {
        if (artifact.title.toLowerCase().includes(searchTerm) ||
            artifact.content.toLowerCase().includes(searchTerm) ||
            artifact.type.toLowerCase().includes(searchTerm)) {
            results.push(artifact);
        }
    }
    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
function applyArtifactFilters(artifacts, options) {
    let filtered = [...artifacts];
    if (options.type) {
        filtered = filtered.filter(a => a.type === options.type);
    }
    if (options.conversationId) {
        filtered = filtered.filter(a => a.conversationId === options.conversationId);
    }
    return filtered;
}
function sortArtifactsHelper(artifacts, options) {
    const sortBy = options.sortBy || 'updatedAt';
    const sortOrder = options.sortOrder || 'desc';
    return artifacts.sort((a, b) => {
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
}
function paginateArtifactsHelper(artifacts, options) {
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
}
// In-memory storage for demo purposes
const artifactStore = new Map();
export function createArtifactStorageAdapter() {
    return {
        async storeArtifact(artifactData) {
            validateArtifactHelper(artifactData);
            const now = new Date();
            const artifact = {
                ...artifactData,
                id: generateArtifactId(),
                createdAt: now,
                updatedAt: now,
                metadata: {
                    ...artifactData.metadata,
                    size: artifactData.content?.length || 0,
                    version: 1,
                    tags: artifactData.metadata?.tags || []
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
            if (updates.content) {
                validateArtifactHelper({ ...existing, ...updates });
            }
            const updated = {
                ...existing,
                ...updates,
                updatedAt: new Date(),
                metadata: {
                    ...existing.metadata,
                    ...updates.metadata,
                    version: existing.metadata.version + 1
                }
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
            return searchArtifactsHelper(artifactStore, query);
        },
        async listArtifacts(options = {}) {
            const allArtifacts = Array.from(artifactStore.values());
            const filtered = applyArtifactFilters(allArtifacts, options);
            const sorted = sortArtifactsHelper(filtered, options);
            return paginateArtifactsHelper(sorted, options);
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
        }
    };
}
//# sourceMappingURL=artifact-storage-adapter.js.map