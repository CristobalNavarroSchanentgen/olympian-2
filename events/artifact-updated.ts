/**
 * Artifact Updated Event
 * Emitted when an artifact is updated
 */

export interface ArtifactUpdatedEvent {
  artifactId: string;
  conversationId: string;
  previousVersion: number;
  newVersion: number;
  timestamp: Date;
  changeDescription?: string;
}
