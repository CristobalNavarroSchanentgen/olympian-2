/**
 * Chat Interaction Pattern Contract
 * Defines how user actions flow through features to create coherent experience
 */

export interface ChatInteractionContract {
  /**
   * User Input -> Model Selection -> Processing -> Response
   * Pattern: Smart routing based on content analysis
   */
  processUserMessage(input: UserInput): Promise<ProcessedResponse>;
  
  /**
   * Tool Need Detected -> Tool Selection -> Execution -> Integration
   * Pattern: Seamless tool integration without user friction
   */
  executeToolWorkflow(toolNeed: ToolNeed): Promise<ToolResult>;
  
  /**
   * Context Growth -> Memory Management -> Optimization
   * Pattern: Invisible context management preserving user flow
   */
  manageConversationMemory(conversation: Conversation): Promise<OptimizedContext>;
  
  /**
   * Artifact Creation -> Versioning -> Collaboration
   * Pattern: Persistent work artifacts users can build upon
   */
  manageArtifactLifecycle(artifact: ArtifactChange): Promise<ArtifactState>;
}

export interface UserInput {
  message: string;
  attachments?: File[];
  conversationContext: ConversationState;
  userIntent: 'question' | 'task' | 'exploration' | 'refinement';
}

export interface ProcessedResponse {
  content: string;
  reasoning?: string;
  toolsUsed: string[];
  suggestedActions: UserAction[];
  confidenceLevel: number;
}

export interface ToolNeed {
  category: 'research' | 'coding' | 'analysis' | 'creation';
  requirements: string[];
  userPermission: boolean;
}

export interface UserAction {
  type: 'copy-code' | 'create-file' | 'run-command' | 'explore-more';
  description: string;
  data: any;
}
