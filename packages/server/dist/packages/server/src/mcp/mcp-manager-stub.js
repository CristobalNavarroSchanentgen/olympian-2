"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPManager = void 0;
class MCPManager {
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
exports.MCPManager = MCPManager;
//# sourceMappingURL=mcp-manager-stub.js.map