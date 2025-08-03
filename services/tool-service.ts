export interface ToolService {
  invokeTool(toolName: string, params: any): Promise<any>;
  getAvailableTools(): Promise<string[]>;
  getToolDefinition(toolName: string): Promise<any>;
}

