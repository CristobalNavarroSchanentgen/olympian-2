import { ToolDefinition } from '../../../../models/mcp';
import { ExecutionResult } from '../../../../models/mcp';
import { 
  createProtocolHandler,
  ProtocolMessage,
  ProtocolResponse
} from '../../../../utils/protocol-handler';

/**
 * MCP protocol adapter for tool execution
 * Transforms protocol handling utilities for tool-executor feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by tool-executor
 */

export interface McpProtocolAdapter {
  // Tool discovery
  discoverTools(serverId: string): Promise<ToolDefinition[]>;
  getToolSchema(serverId: string, toolName: string): Promise<ToolSchema>;
  
  // Tool execution
  executeToolCall(serverId: string, toolName: string, parameters: any): Promise<ExecutionResult>;
  
  // Protocol management
  sendInitialize(serverId: string): Promise<void>;
  sendListTools(serverId: string): Promise<ToolDefinition[]>;
  sendCallTool(serverId: string, name: string, arguments: any): Promise<any>;
}

export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
  examples?: ToolExample[];
}

export interface ToolExample {
  description: string;
  input: any;
  output: any;
}

export function createMcpProtocolAdapter(): McpProtocolAdapter {
  const protocolHandler = createProtocolHandler({
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
      } catch (error) {
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
      } catch (error) {
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
      } catch (error) {
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
      const message: ProtocolMessage = {
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
      const message: ProtocolMessage = {
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
      const message: ProtocolMessage = {
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
    generateId(): string {
      return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    transformToolList(tools: any[]): ToolDefinition[] {
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

    extractCapabilities(tool: any): string[] {
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

    categorizeResource(name: string): string {
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

    extractTags(tool: any): string[] {
      const tags = [];
      const name = tool.name.toLowerCase();
      
      if (name.includes('create')) tags.push('create');
      if (name.includes('read') || name.includes('get')) tags.push('read');
      if (name.includes('update') || name.includes('modify')) tags.push('update');
      if (name.includes('delete') || name.includes('remove')) tags.push('delete');
      
      return tags;
    }
  };
}
