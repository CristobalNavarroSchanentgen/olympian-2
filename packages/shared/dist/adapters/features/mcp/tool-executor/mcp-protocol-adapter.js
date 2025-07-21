"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMcpProtocolAdapter = createMcpProtocolAdapter;
const protocol_handler_1 = require("../../../utils/protocol-handler");
function createMcpProtocolAdapter() {
    const protocolHandler = (0, protocol_handler_1.createProtocolHandler)({
        transport: 'stdio',
        timeout: 30000
    });
    return {
        async discoverTools(serverId) {
            try {
                // Send initialize message first
                await this.sendInitialize(serverId);
                // Then list tools
                return await this.sendListTools(serverId);
            }
            catch (error) {
                throw new Error(`Tool discovery failed for ${serverId}: ${error.message}`);
            }
        },
        async getToolSchema(serverId, toolName) {
            try {
                const tools = await this.sendListTools(serverId);
                const tool = tools.find(t => t.name === toolName);
                if (!tool) {
                    throw new Error(`Tool ${toolName} not found`);
                }
                return {
                    name: tool.name,
                    description: tool.description,
                    inputSchema: tool.inputSchema,
                    outputSchema: tool.outputSchema,
                    examples: tool.examples || []
                };
            }
            catch (error) {
                throw new Error(`Failed to get schema for ${toolName}: ${error.message}`);
            }
        },
        async executeToolCall(serverId, toolName, parameters) {
            try {
                const startTime = Date.now();
                // Execute the tool call
                const result = await this.sendCallTool(serverId, toolName, parameters);
                const endTime = Date.now();
                const executionTime = endTime - startTime;
                return {
                    success: true,
                    result,
                    executionTime,
                    serverId,
                    toolName,
                    parameters,
                    timestamp: new Date(),
                    metadata: {
                        protocolVersion: '1.0',
                        serverResponse: true
                    }
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error.message,
                    executionTime: Date.now(),
                    serverId,
                    toolName,
                    parameters,
                    timestamp: new Date(),
                    metadata: {
                        protocolVersion: '1.0',
                        serverResponse: false
                    }
                };
            }
        },
        async sendInitialize(serverId) {
            const message = {
                jsonrpc: '2.0',
                id: this.generateId(),
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        tools: {},
                        prompts: {},
                        resources: {}
                    },
                    clientInfo: {
                        name: 'olympian-ai',
                        version: '1.0.0'
                    }
                }
            };
            const response = await protocolHandler.sendMessage(message);
            if (response.error) {
                throw new Error(`Initialize failed: ${response.error.message}`);
            }
            // Send initialized notification
            await protocolHandler.sendNotification({
                jsonrpc: '2.0',
                method: 'notifications/initialized'
            });
        },
        async sendListTools(serverId) {
            const message = {
                jsonrpc: '2.0',
                id: this.generateId(),
                method: 'tools/list',
                params: {}
            };
            const response = await protocolHandler.sendMessage(message);
            if (response.error) {
                throw new Error(`List tools failed: ${response.error.message}`);
            }
            return this.transformToolList(response.result?.tools || []);
        },
        async sendCallTool(serverId, name, arguments) {
            const message = {
                jsonrpc: '2.0',
                id: this.generateId(),
                method: 'tools/call',
                params: {
                    name,
                    arguments: arguments || {}
                }
            };
            const response = await protocolHandler.sendMessage(message);
            if (response.error) {
                throw new Error(`Tool call failed: ${response.error.message}`);
            }
            return response.result;
        },
        // Helper methods
        generateId() {
            return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        },
        transformToolList(tools) {
            return tools.map(tool => ({
                name: tool.name,
                description: tool.description || 'No description provided',
                inputSchema: tool.inputSchema || {
                    type: 'object',
                    properties: {},
                    required: []
                },
                outputSchema: tool.outputSchema,
                examples: tool.examples || [],
                serverId: '', // Will be set by caller
                capabilities: this.extractCapabilities(tool),
                metadata: {
                    version: tool.version || '1.0.0',
                    category: this.categorizeResource(tool.name),
                    tags: this.extractTags(tool),
                    discoveredAt: new Date()
                }
            }));
        },
        extractCapabilities(tool) {
            const capabilities = [];
            if (tool.inputSchema?.properties) {
                const props = Object.keys(tool.inputSchema.properties);
                if (props.includes('file') || props.includes('path')) {
                    capabilities.push('file-operations');
                }
                if (props.includes('url') || props.includes('endpoint')) {
                    capabilities.push('network-operations');
                }
                if (props.includes('query') || props.includes('search')) {
                    capabilities.push('search');
                }
            }
            return capabilities;
        },
        categorizeResource(name) {
            if (name.includes('file') || name.includes('read') || name.includes('write')) {
                return 'file-system';
            }
            if (name.includes('search') || name.includes('find') || name.includes('query')) {
                return 'search';
            }
            if (name.includes('git') || name.includes('repo')) {
                return 'version-control';
            }
            if (name.includes('api') || name.includes('http') || name.includes('fetch')) {
                return 'api';
            }
            return 'general';
        },
        extractTags(tool) {
            const tags = [];
            const name = tool.name.toLowerCase();
            if (name.includes('create'))
                tags.push('create');
            if (name.includes('read') || name.includes('get'))
                tags.push('read');
            if (name.includes('update') || name.includes('modify'))
                tags.push('update');
            if (name.includes('delete') || name.includes('remove'))
                tags.push('delete');
            return tags;
        }
    };
}
//# sourceMappingURL=mcp-protocol-adapter.js.map