/**
 * Artifact Model
 * Represents a created artifact in the system
 */

export type ArtifactType = 'code' | 'text' | 'html' | 'svg' | 'react' | 'mermaid';

export interface ArtifactMetadata {
  size: number;
  version: number;
  tags: string[];
  language?: string;
  framework?: string;
  author?: string;
  lastModified?: Date;
  [key: string]: unknown;
}

export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  content: string;
  conversationId: string;
  messageId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: ArtifactMetadata;
}
