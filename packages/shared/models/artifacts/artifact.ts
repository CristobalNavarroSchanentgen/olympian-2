/**
 * Artifact model - pure types only
 */

export interface Artifact {
  readonly id: string;
  readonly conversationId: string;
  readonly messageId: string;
  readonly type: ArtifactType;
  readonly title: string;
  readonly content: string;
  readonly metadata: ArtifactMetadata;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type ArtifactType = 
  | 'code' 
  | 'html' 
  | 'react' 
  | 'svg' 
  | 'mermaid' 
  | 'json' 
  | 'csv' 
  | 'markdown' 
  | 'text';

export interface ArtifactMetadata {
  readonly language?: string;
  readonly size: number;
  readonly version: number;
  readonly tags: string[];
  readonly description?: string;
}

export interface ArtifactVersion {
  readonly id: string;
  readonly artifactId: string;
  readonly version: number;
  readonly content: string;
  readonly changes: string;
  readonly createdAt: Date;
}

export interface ArtifactValidation {
  readonly valid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: string[];
  readonly size: number;
}

export interface ValidationError {
  readonly code: string;
  readonly message: string;
  readonly line?: number;
  readonly column?: number;
}

export interface ArtifactFilter {
  readonly type?: ArtifactType;
  readonly conversationId?: string;
  readonly tags?: string[];
  readonly dateRange?: {
    readonly start: Date;
    readonly end: Date;
  };
}
