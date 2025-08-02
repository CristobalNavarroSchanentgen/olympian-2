/**
 * Artifact Manager Contract
 * Manages code artifacts, files, and generated content
 */

export interface Artifact {
  id: string;
  conversationId: string;
  type: 'code' | 'document' | 'image' | 'data';
  title: string;
  content: string;
  language?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface ArtifactCreateRequest {
  conversationId: string;
  type: 'code' | 'document' | 'image' | 'data';
  title: string;
  content: string;
  language?: string;
  metadata?: any;
}

export interface ArtifactUpdateRequest {
  title?: string;
  content?: string;
  language?: string;
  metadata?: any;
}

export interface ArtifactManagerContract {
  /**
   * Get artifacts for a conversation
   */
  getArtifacts(conversationId: string): Promise<Artifact[]>;
  
  /**
   * Get specific artifact by ID
   */
  getArtifact(id: string): Promise<Artifact | null>;
  
  /**
   * Create a new artifact
   */
  createArtifact(request: ArtifactCreateRequest): Promise<Artifact>;
  
  /**
   * Update an existing artifact
   */
  updateArtifact(id: string, updates: ArtifactUpdateRequest): Promise<Artifact | null>;
  
  /**
   * Delete an artifact
   */
  deleteArtifact(id: string): Promise<boolean>;
  
  /**
   * Get artifact versions
   */
  getArtifactVersions(id: string): Promise<Artifact[]>;
  
  /**
   * Search artifacts by content or title
   */
  searchArtifacts(query: string, conversationId?: string): Promise<Artifact[]>;
}
