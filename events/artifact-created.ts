/**
 * Artifact Created Event
 * Emitted when a new artifact is created
 */

export interface ArtifactCreatedEvent {
  artifactId: string;
  conversationId: string;
  title: string;
  type: string;
  timestamp: Date;
  version: number;
}
