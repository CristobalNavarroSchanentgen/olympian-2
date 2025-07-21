export class MCPManager {
  async initialize(): Promise<void> {
    console.log('MCP Manager stub initialized');
  }
  
  getServerStatus() {
    return {};
  }
  
  getAllTools() {
    return [];
  }
  
  async executeTool(serverName: string, toolName: string, args: any): Promise<any> {
    return { success: true, result: 'stub' };
  }
}
