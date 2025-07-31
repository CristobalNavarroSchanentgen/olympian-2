/**
 * Artifact Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */

import { ArtifactService } from '@olympian/shared/services/artifact-service';
import { Artifact, ArtifactType } from '@olympian/shared/models/artifacts/artifact';

export class ArtifactServiceImpl implements ArtifactService {
  private artifacts: Map<string, Artifact> = new Map();
  private conversationArtifacts: Map<string, string[]> = new Map();
  private nextId = 1;

  async createArtifact(
    conversationId: string,
    messageId: string,
    type: string,
    title: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<Artifact> {    const id = `art_${this.nextId++}`;
    const now = new Date();
    
    const artifact: Artifact = {
      id,
      conversationId,
      title,
      type,
      content,
      createdAt: now,
      updatedAt: now,
      metadata: metadata || {}
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
      updatedAt: new Date()
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
    // Remove the artifact
    return this.artifacts.delete(id);
  }

  async getConversationArtifacts(conversationId: string): Promise<Artifact[]> {
    const artifactIds = this.conversationArtifacts.get(conversationId) || [];
    const artifacts = artifactIds
      .map(id => this.artifacts.get(id))
      .filter((art): art is Artifact => art !== undefined);
    
    // Sort by creation time
    return artifacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}
