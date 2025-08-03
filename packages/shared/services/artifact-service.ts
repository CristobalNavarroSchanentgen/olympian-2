/**
 * Artifact management service contract
 */

import { Artifact, ArtifactVersion, ArtifactFilter } from '../models/artifacts';

export interface ArtifactService {
  /**
   * Create new artifact
   */
  createArtifact(
    conversationId: string,
    messageId: string,
    type: string,
    title: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<Artifact>;

  /**
   * Get artifact by ID
   */
  getArtifact(id: string): Promise<Artifact | null>;

  /**
   * Update artifact
   */
  updateArtifact(
    id: string,
    updates: Partial<Pick<Artifact, 'title' | 'content' | 'metadata'>>
  ): Promise<Artifact>;

  /**
   * Delete artifact
   */
  deleteArtifact(id: string): Promise<boolean>;

  /**
   * List artifacts with filtering
   */
  listArtifacts(
    filter?: ArtifactFilter,
    limit?: number,
    offset?: number
  ): Promise<Artifact[]>;

  /**
   * Get artifacts for conversation
   */
  getConversationArtifacts(conversationId: string): Promise<Artifact[]>;

  /**
   * Get artifact versions
   */
  getArtifactVersions(artifactId: string): Promise<ArtifactVersion[]>;

  /**
   * Create artifact version
   */
  createVersion(
    artifactId: string,
    content: string,
    changes: string
  ): Promise<ArtifactVersion>;

  /**
   * Restore artifact to version
   */
  restoreToVersion(
    artifactId: string,
    version: number
  ): Promise<Artifact>;

  /**
   * Validate artifact content
   */
  validateArtifact(
    type: string,
    content: string
  ): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;

  /**
   * Search artifacts
   */
  searchArtifacts(
    query: string,
    filter?: ArtifactFilter,
    limit?: number
  ): Promise<Artifact[]>;

  /**
   * Get artifact count
   */
  getArtifactCount(filter?: ArtifactFilter): Promise<number>;
}
