import { MemoryService } from '../../../services/memory-service';

/**
 * Memory Service Implementation
 * Handles conversation memory and context management
 */
export class MemoryServiceImpl implements MemoryService {
  private contextStore = new Map<string, any>();
  private tokenBudgets = new Map<string, number>();

  async updateContext(conversationId: string, context: any): Promise<void> {
    this.contextStore.set(conversationId, context);
  }

  async getContext(conversationId: string): Promise<any> {
    return this.contextStore.get(conversationId) || null;
  }

  async cleanMemory(conversationId: string): Promise<void> {
    this.contextStore.delete(conversationId);
    this.tokenBudgets.delete(conversationId);
  }

  async getTokenBudget(conversationId: string): Promise<number> {
    return this.tokenBudgets.get(conversationId) || 4096;
  }
}
