import { Artifact } from '../../../../models/artifacts/index';
import { validateArtifact } from '../../../../utils/artifact-validator';

/**
 * Artifact storage adapter for artifact management
 * Transforms storage operations for artifact-manager feature
 */

export interface ArtifactStorageAdapter {
  storeArtifact(artifact: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artifact>;
  retrieveArtifact(id: string): Promise<Artifact | null>;
  updateArtifact(id: string, updates: Partial<Artifact>): Promise<Artifact>;
  deleteArtifact(id: string): Promise<void>;
  
  // Search and filtering
  searchArtifacts(query: string): Promise<Artifact[]>;
  listArtifacts(options: ListOptions): Promise<ArtifactsList>;
  getArtifactsByConversation(conversationId: string): Promise<Artifact[]>;
  getArtifactsByType(type: string): Promise<Artifact[]>;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'type';
  sortOrder?: 'asc' | 'desc';
  type?: string;
  conversationId?: string;
}

export interface ArtifactsList {
  artifacts: Artifact[];
  total: number;
  hasMore: boolean;
}

// Helper function for generating IDs
function generateArtifactId(): string {
  return `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// In-memory storage for demo purposes
const artifactStore = new Map<string, Artifact>();

export function createArtifactStorageAdapter(): ArtifactStorageAdapter {
  return {
    async storeArtifact(artifactData) {
      // Validate artifact before storing
      const validation = validateArtifact(artifactData);
      if (!validation.isValid) {
        throw new Error(`Artifact validation failed: ${validation.errors.join(', ')}`);
      }
      
      const now = new Date();
      const artifact: Artifact = {
        ...artifactData,
        id: generateArtifactId(),
        createdAt: now,
        updatedAt: now,
        metadata: {
          ...artifactData.metadata,
          size: artifactData.content?.length || 0,
          version: 1,
          tags: artifactData.metadata?.tags || []
        }      };
      
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
      
      // Validate content if it\'s being updated
      if (updates.content) {
        const validation = validateArtifact({ ...existing, ...updates });
        if (!validation.isValid) {
          throw new Error(`Artifact validation failed: ${validation.errors.join(', ')}`);
        }
      }
      
      const updated: Artifact = {
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
      const results: Artifact[] = [];
      const searchTerm = query.toLowerCase();
      
      for (const artifact of artifactStore.values()) {
        if (
          artifact.title.toLowerCase().includes(searchTerm) ||
          artifact.content.toLowerCase().includes(searchTerm) ||
          artifact.type.toLowerCase().includes(searchTerm)
        ) {
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
        let aValue: any, bValue: any;
        
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
        } else {
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
    }
  };
}
