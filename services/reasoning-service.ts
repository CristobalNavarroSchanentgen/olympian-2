export interface ReasoningService {
  addReasoningBlock(conversationId: string, reasoning: any): Promise<void>;
  getReasoningBlocks(conversationId: string): Promise<any[]>;
  toggleReasoningPanel(userId: string, visible: boolean): Promise<void>;
  exportReasoning(conversationId: string): Promise<string>;
}

