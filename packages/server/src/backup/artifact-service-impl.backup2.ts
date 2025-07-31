/**
 * Artifact Service Implementation
 * MongoDB-backed persistence for artifacts with versioning support
 */

import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { Artifact, ArtifactType } from '@olympian/shared/models/artifacts/artifact';
import { ArtifactVersion, ArtifactFilter } from '@olympian/shared/models/artifacts';
import { ArtifactRepository } from '../database/artifact-repository';

export class ArtifactServiceImpl implements ArtifactService {
  private artifactRepo: ArtifactRepository;
  // Note: Version support would require additional repository for production
  private artifactVersions: Map<string, ArtifactVersion[]> = new Map();
  private nextVersionId = 1;

  constructor() {
    this.artifactRepo = new ArtifactRepository();
  }

  async createArtifact(
    conversationId: string,
    messageId: string,
    type: string,
    title: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<Artifact> {
    const now = new Date();
    
    const artifactData = {
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
    
    return await this.artifactRepo.create(artifactData);
  }

  async getArtifact(id: string): Promise<Artifact | null> {
    return await this.artifactRepo.findById(id);
  }

  async updateArtifact(
    id: string,
    updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>
  ): Promise<Artifact> {
    const updated = await this.artifactRepo.update(id, {
      ...updates,
      metadata: {
        ...updates.metadata,
        size: updates.content?.length,
        version: (updates.metadata?.version as number) || 1
      }
    });
    
    if (!updated) {
      return false;
    }
    return updated;
  }

  async deleteArtifact(id: string): Promise<boolean> {
    const deleted = await this.artifactRepo.delete(id);
    if (!deleted) {
      return false;
    }
    
    // Clean up versions (in-memory for now)
    this.artifactVersions.delete(id);
  }

  async getConversationArtifacts(conversationId: string): Promise<Artifact[]> {
    return await this.artifactRepo.findByConversation(conversationId);
  }

  async getMessageArtifacts(messageId: string): Promise<Artifact[]> {
    return await this.artifactRepo.findByMessage(messageId);
  }

  async listArtifacts(filter?: ArtifactFilter): Promise<Artifact[]> {
    return await this.artifactRepo.list(filter);
  }

  // Version management methods (using in-memory storage for now)
  async getArtifactVersions(artifactId: string): Promise<ArtifactVersion[]> {
    return this.artifactVersions.get(artifactId) || [];
  }

  async createVersion(
    artifactId: string,
    content: string,
    changeDescription?: string
  ): Promise<ArtifactVersion> {
    const artifact = await this.getArtifact(artifactId);
    if (!artifact) {
      return false;
    }

    const version: ArtifactVersion = {
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
    this.artifactVersions.get(artifactId)!.push(version);

    return version;
  }

  async restoreToVersion(artifactId: string, versionId: string): Promise<Artifact> {
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

  async validateArtifact(artifactId: string): Promise<{ valid: boolean; errors: string[] }> {
    const artifact = await this.getArtifact(artifactId);
    if (!artifact) {
      return { valid: false, errors: ['Artifact not found'] };
    }

    const errors: string[] = [];
    
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

  async searchArtifacts(query: string, filter?: ArtifactFilter): Promise<Artifact[]> {
    return await this.artifactRepo.search(query, filter);
  }

  async getArtifactCount(filter?: ArtifactFilter): Promise<number> {
    return await this.artifactRepo.count(filter);
  }
}

