/**
 * Artifact Deleted Event
 * Emitted when an artifact is deleted
 */

export interface ArtifactDeletedEvent {
  artifactId: string;
  conversationId: string;
  title: string;
  timestamp: Date;
  version: number;
  reason?: string;
}
