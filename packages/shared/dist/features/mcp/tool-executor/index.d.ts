/**
 * Feature Implementation: MCP Tool Executor
 */
import { ToolExecutorContract, ToolExecutorDependencies } from "./contract";
import { ToolDefinition } from "../../../models/mcp/tool-definition";
import { ExecutionResult } from "../../../models/mcp/execution-result";
export declare class ToolExecutor implements ToolExecutorContract {
    private deps;
    private toolCache;
    private executionQueue;
    constructor(deps: ToolExecutorDependencies);
    discoverTools(serverName?: string): Promise<ToolDefinition[]>;
    private discoverToolsFromServer;
    executeTool(params: {
        serverName: string;
        toolName: string;
        arguments: Record<string, unknown>;
        timeout?: number;
    }): Promise<ExecutionResult>;
    private executeToolInternal;
    private validateToolArguments;
    private createTimeoutPromise;
    getExecutionHistory(limit?: number): Promise<ExecutionResult[]>;
    cancelExecution(executionId: string): Promise<void>;
    getToolDefinition(serverName: string, toolName: string): Promise<ToolDefinition | null>;
    refreshToolCache(): Promise<void>;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map