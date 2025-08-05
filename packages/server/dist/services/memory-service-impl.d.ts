import { MemoryService } from '@olympian/shared/services/memory-service';
import { MemoryContext, ContextWindow, ContextStats } from '@olympian/shared/models/chat/memory-context';
/**
 * Memory Service Implementation
 * Handles conversation memory and context management
 */
export declare class MemoryServiceImpl implements MemoryService {
    private contextStore;
    private configs;
    getMemoryContext(conversationId: string): Promise<MemoryContext | null>;
    updateMemoryContext(conversationId: string, context: Partial<MemoryContext>): Promise<MemoryContext>;
    cleanMemory(conversationId: string, reason?: 'token_limit' | 'message_limit' | 'manual'): Promise<{
        messagesRemoved: number;
        tokensFreed: number;
    }>;
    getMemoryStats(conversationId: string): Promise<ContextStats>;
    needsCleanup(conversationId: string): Promise<boolean>;
    getOptimalContextWindow(conversationId: string, maxTokens: number): Promise<ContextWindow>;
    setMemoryConfig(conversationId: string, config: {
        maxMessages: number;
        maxTokens: number;
        autoCleanup: boolean;
    }): Promise<boolean>;
    getMemoryConfig(conversationId: string): Promise<{
        maxMessages: number;
        maxTokens: number;
        autoCleanup: boolean;
    } | null>;
}
