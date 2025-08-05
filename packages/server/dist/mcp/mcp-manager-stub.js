export class MCPManager {
    async initialize() {
        console.log('MCP Manager stub initialized');
    }
    getServerStatus() {
        return {};
    }
    getAllTools() {
        return [];
    }
    async executeTool(serverName, toolName, args) {
        return { success: true, result: 'stub' };
    }
}
//# sourceMappingURL=mcp-manager-stub.js.map