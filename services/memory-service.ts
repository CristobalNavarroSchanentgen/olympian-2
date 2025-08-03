export interface MemoryService {
  updateContext(conversationId: string, context: any): Promise<void>;
  getContext(conversationId: string): Promise<any>;
  cleanMemory(conversationId: string): Promise<void>;
  getTokenBudget(conversationId: string): Promise<number>;
}

