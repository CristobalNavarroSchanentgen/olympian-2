/**
 * Feature Implementation: Artifact Manager
 */

import { ArtifactManagerContract, ArtifactManagerDependencies } from "./contract";
import { Artifact } from "../../../models/artifacts/artifact";
import { ArtifactVersion } from "../../../models/artifacts/version";

export class ArtifactManager implements ArtifactManagerContract {
  constructor(private deps: ArtifactManagerDependencies) {}

  async createArtifact(params: {
    conversationId: string;
    messageId: string;
    type: string;
    title: string;
    content: string;
    language?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Artifact> {
    // Validate content
    const validation = this.deps.artifactValidator.validate({
      type: params.type,
      content: params.content,
      language: params.language
    });

    if (!validation.valid) {
      throw new Error(`Invalid artifact: ${validation.errors.join(", ")}`);
    }

    const artifact: Artifact = {
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

  async updateArtifact(artifactId: string, updates: {
    title?: string;
    content?: string;
    metadata?: Record<string, unknown>;
    changeDescription?: string;
  }): Promise<Artifact> {
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

    const updated: Artifact = {
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

  async getArtifact(artifactId: string): Promise<Artifact | null> {
    return await this.deps.artifactStorage.findById(artifactId);
  }

  async deleteArtifact(artifactId: string): Promise<void> {
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

  async listArtifacts(params: {
    conversationId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ artifacts: Artifact[]; total: number }> {
    return await this.deps.artifactStorage.list({
      conversationId: params.conversationId,
      type: params.type,
      limit: params.limit || 50,
      offset: params.offset || 0
    });
  }

  async searchArtifacts(query: string, options?: {
    conversationId?: string;
    type?: string;
    limit?: number;
  }): Promise<Artifact[]> {
    return await this.deps.artifactStorage.search({
      query,
      conversationId: options?.conversationId,
      type: options?.type,
      limit: options?.limit || 50
    });
  }

  async getVersionHistory(artifactId: string): Promise<ArtifactVersion[]> {
    return await this.deps.versionTracker.getVersions(artifactId);
  }

  async revertToVersion(artifactId: string, version: number): Promise<Artifact> {
    const targetVersion = await this.deps.versionTracker.getVersion(artifactId, version);
    if (!targetVersion) {
      throw new Error(`Version ${version} not found for artifact ${artifactId}`);
    }

    return await this.updateArtifact(artifactId, {
      content: targetVersion.content,
      changeDescription: `Reverted to version ${version}`
    });
  }

  async duplicateArtifact(artifactId: string, newTitle?: string): Promise<Artifact> {
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

  async validateArtifact(type: string, content: string, language?: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
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

  async getArtifactsByConversation(conversationId: string): Promise<Artifact[]> {
    const result = await this.listArtifacts({
      conversationId,
      limit: 1000
    });
    return result.artifacts;
  }

  async getArtifactsByMessage(messageId: string): Promise<Artifact[]> {
    return await this.deps.artifactStorage.findByMessage(messageId);
  }

  private generateArtifactId(): string {
    return `art-${Date.now()}-${Math.random().toString(36).substr(2)}`;
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
