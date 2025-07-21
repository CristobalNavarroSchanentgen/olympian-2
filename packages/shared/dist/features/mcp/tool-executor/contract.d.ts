/**
 * MCP Tool Executor Contract
 * Defines the interface for executing MCP tools
 * Follows AI-Native architecture - focused contract under 200 lines
 */
import type { ToolDefinition } from '../../../models/mcp';
import type { ExecutionResult } from '../../../models/mcp';
/**
 * Tool execution parameters
 */
export interface ToolExecutionParams {
    toolName: string;
    arguments: Record<string, unknown>;
    serverId?: string;
    timeout?: number;
    requireConfirmation?: boolean;
}
/**
 * Tool execution result with metadata
 */
export interface ToolExecutionResponse {
    executionId: string;
    result: ExecutionResult;
    duration: number;
    toolUsed: ToolDefinition;
}
/**
 * Batch execution parameters
 */
export interface BatchExecutionParams {
    executions: ToolExecutionParams[];
    mode: 'sequential' | 'parallel';
    stopOnError?: boolean;
    maxConcurrency?: number;
}
/**
 * Tool validation result
 */
export interface ToolValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
/**
 * Tool execution capabilities
 */
export interface ToolCapabilities {
    maxConcurrentExecutions: number;
    supportedTimeouts: number[];
    requiresConfirmation: boolean;
    supportsBatch: boolean;
}
/**
 * Contract for MCP tool execution feature
 * Defines all external interfaces this feature provides
 */
export interface ToolExecutorContract {
    /**
     * Execute a single MCP tool with parameters
     */
    executeTool(params: ToolExecutionParams): Promise<ToolExecutionResponse>;
    /**
     * Execute multiple tools in batch
     */
    executeTools(params: BatchExecutionParams): Promise<ToolExecutionResponse[]>;
    /**
     * Validate tool parameters before execution
     */
    validateToolExecution(params: ToolExecutionParams): Promise<ToolValidationResult>;
    /**
     * Get available tools from connected servers
     */
    getAvailableTools(serverId?: string): Promise<ToolDefinition[]>;
    /**
     * Get tool definition by name
     */
    getToolDefinition(toolName: string, serverId?: string): Promise<ToolDefinition | null>;
    /**
     * Cancel running tool execution
     */
    cancelExecution(executionId: string): Promise<boolean>;
    /**
     * Get execution status
     */
    getExecutionStatus(executionId: string): Promise<'pending' | 'running' | 'completed' | 'failed' | 'cancelled'>;
    /**
     * Get execution history for debugging
     */
    getExecutionHistory(limit?: number): Promise<ToolExecutionResponse[]>;
    /**
     * Get tool execution capabilities
     */
    getCapabilities(): Promise<ToolCapabilities>;
    /**
     * Clear execution history
     */
    clearHistory(): Promise<void>;
}
/**
 * Events that the tool executor can emit
 */
export interface ToolExecutorEvents {
    onToolStarted: (executionId: string, toolName: string) => void;
    onToolCompleted: (response: ToolExecutionResponse) => void;
    onToolFailed: (executionId: string, error: Error) => void;
    onToolCancelled: (executionId: string) => void;
    onValidationFailed: (toolName: string, errors: string[]) => void;
}
/**
 * Configuration for tool executor
 */
export interface ToolExecutorConfig {
    defaultTimeout: number;
    maxConcurrentExecutions: number;
    enableValidation: boolean;
    requireConfirmationByDefault: boolean;
    retryAttempts: number;
    retryDelay: number;
}
//# sourceMappingURL=contract.d.ts.map