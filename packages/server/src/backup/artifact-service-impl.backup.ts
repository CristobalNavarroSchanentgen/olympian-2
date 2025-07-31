/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */

import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { Artifact, ArtifactType } from '@olympian/shared/models/artifacts/artifact';
import { ArtifactVersion, ArtifactFilter } from '@olympian/shared/models/artifacts';

export class ArtifactServiceImpl implements ArtifactService {
  private artifacts: Map<string, Artifact> = new Map();
  private conversationArtifacts: Map<string, string[]> = new Map();
  private artifactVersions: Map<string, ArtifactVersion[]> = new Map();
  private nextId = 1;
  private nextVersionId = 1;

  async createArtifact(
    conversationId: string,
    messageId: string,
    type: string,
    title: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<Artifact> {
    const id = `art_${this.nextId++}`;
    const now = new Date();
    
    const artifact: Artifact = {
      id,
      conversationId,
      messageId,
      title,
      type: type as ArtifactType,
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
    this.conversationArtifacts.get(conversationId)!.push(id);
    
    return artifact;
  }

  async getArtifact(id: string): Promise<Artifact | null> {
    return this.artifacts.get(id) || null;
  }

  async updateArtifact(
    id: string,
    updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>
  ): Promise<Artifact> {
    const artifact = this.artifacts.get(id);
    if (!artifact) {
      throw new Error(`Artifact ${id} not found`);
    }

    const updated: Artifact = {
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

  async deleteArtifact(id: string): Promise<boolean> {
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

  async listArtifacts(
    filter?: ArtifactFilter,
    limit?: number,
    offset?: number
  ): Promise<Artifact[]> {
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
        artifacts = artifacts.filter(art => art.createdAt >= filter.createdAfter!);
      }
      if (filter.createdBefore) {
        artifacts = artifacts.filter(art => art.createdAt <= filter.createdBefore!);
      }
      if (filter.tags && filter.tags.length > 0) {
        artifacts = artifacts.filter(art => 
          filter.tags!.some(tag => art.metadata.tags?.includes(tag))
        );
      }
    }
    
    // Sort by creation time (newest first)
    artifacts = artifacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Apply pagination
    const start = offset || 0;
    const end = limit ? start + limit : undefined;
    return artifacts.slice(start, end);
  }

  async getConversationArtifacts(conversationId: string): Promise<Artifact[]> {
    const artifactIds = this.conversationArtifacts.get(conversationId) || [];
    const artifacts = artifactIds
      .map(id => this.artifacts.get(id))
      .filter((art): art is Artifact => art !== undefined);
    
    // Sort by creation time
    return artifacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getArtifactVersions(artifactId: string): Promise<ArtifactVersion[]> {
    return this.artifactVersions.get(artifactId) || [];
  }

  async createVersion(
    artifactId: string,
    content: string,
    changes: string
  ): Promise<ArtifactVersion> {
    const artifact = this.artifacts.get(artifactId);
    if (!artifact) {
      throw new Error(`Artifact ${artifactId} not found`);
    }

    const versions = this.artifactVersions.get(artifactId) || [];
    const versionNumber = versions.length + 1;
    const versionId = `ver_${this.nextVersionId++}`;

    const version: ArtifactVersion = {
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

  async restoreToVersion(
    artifactId: string,
    version: number
  ): Promise<Artifact> {
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

  async validateArtifact(
    type: string,
    content: string
  ): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

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

  async searchArtifacts(
    query: string,
    filter?: ArtifactFilter,
    limit?: number
  ): Promise<Artifact[]> {
    const searchTerm = query.toLowerCase();
    let artifacts = Array.from(this.artifacts.values());

    // Apply text search
    artifacts = artifacts.filter(art => 
      art.title.toLowerCase().includes(searchTerm) ||
      art.content.toLowerCase().includes(searchTerm) ||
      art.type.toLowerCase().includes(searchTerm)
    );

    // Apply additional filters
    if (filter) {
      if (filter.type) {
        artifacts = artifacts.filter(art => art.type === filter.type);
      }
      if (filter.conversationId) {
        artifacts = artifacts.filter(art => art.conversationId === filter.conversationId);
      }
      if (filter.tags && filter.tags.length > 0) {
        artifacts = artifacts.filter(art => 
          filter.tags!.some(tag => art.metadata.tags?.includes(tag))
        );
      }
    }

    // Sort by relevance (title matches first, then content matches)
    artifacts = artifacts.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchTerm);
      const bTitle = b.title.toLowerCase().includes(searchTerm);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return limit ? artifacts.slice(0, limit) : artifacts;
  }

  async getArtifactCount(filter?: ArtifactFilter): Promise<number> {
    const artifacts = await this.listArtifacts(filter);
    return artifacts.length;
  }
}
