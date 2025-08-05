/**
 * Feature Implementation: Chat Memory Manager
 */
import { MemoryManagerContract, MemoryManagerDependencies } from "./contract";
import { MemoryContext } from "../../../models/chat/memory-context";
export declare class MemoryManager implements MemoryManagerContract {
    private deps;
    constructor(deps: MemoryManagerDependencies);
    optimizeContext(conversationId: string, tokenBudget: number): Promise<MemoryContext>;
    getContext(conversationId: string): Promise<MemoryContext | null>;
    createTokenBudget(conversationId: string, modelTokenLimit: number): Promise<any>;
    getTokenBudget(conversationId: string): Promise<any>;
    updateTokenBudget(conversationId: string, updates: any): Promise<any>;
    getMemoryStatistics(conversationId: string): Promise<any>;
    cleanupOldMemory(conversationId: string): Promise<void>;
    resetMemory(conversationId: string): Promise<void>;
    configureMemory(conversationId: string, config: any): Promise<void>;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map