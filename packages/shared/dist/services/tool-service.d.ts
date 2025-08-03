/**
 * Tool Service Interface
 * Handles tool invocation and management
 */
export interface ToolService {
    /**
     * Invoke a tool with given parameters
     */
    invokeTool(toolName: string, params: any): Promise<any>;
    /**
     * Get list of available tools
     */
    getAvailableTools(): Promise<string[]>;
    /**
     * Get definition of a specific tool
     */
    getToolDefinition(toolName: string): Promise<any>;
}
//# sourceMappingURL=tool-service.d.ts.map