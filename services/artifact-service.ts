export interface ArtifactService {
  createArtifact(conversationId: string, artifact: any): Promise<any>;
  updateArtifact(id: string, artifact: any): Promise<any>;
  getArtifact(id: string): Promise<any>;
  deleteArtifact(id: string): Promise<void>;
  getArtifactsByConversation(conversationId: string): Promise<any[]>;
}

