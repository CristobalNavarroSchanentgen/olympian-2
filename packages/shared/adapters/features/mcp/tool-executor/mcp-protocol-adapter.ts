import { ToolDefinition, ToolParameter } from '../../../../models/mcp';
import { ExecutionResult, ExecutionStatus } from '../../../../models/mcp';
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
  sendCallTool(serverId: string, name: string, args: any): Promise<any>;
}

export interface ToolSchema {
  name: string;
  description: string;
  parameters: ToolParameter[];
}

// AI-Native Pattern: Helper functions outside the returned object
function generateId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractCapabilities(tool: any): string[] {
  const capabilities = [];
  
  if (tool.parameters) {
    const paramNames = tool.parameters.map((p: any) => p.name.toLowerCase());
    
    if (paramNames.some((name: string) => name.includes('file') || name.includes('path'))) {
      capabilities.push('file-operations');
    }
    
    if (paramNames.some((name: string) => name.includes('url') || name.includes('endpoint'))) {
      capabilities.push('network-operations');
    }
    
    if (paramNames.some((name: string) => name.includes('query') || name.includes('search'))) {
      capabilities.push('search');
    }
  }
  
  return capabilities;
}

function categorizeResource(name: string): string {
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
}

function transformToolList(tools: any[], serverId: string): ToolDefinition[] {
  return tools.map(tool => ({
    name: tool.name,
    description: tool.description || 'No description provided',
    parameters: tool.parameters || [],
    serverId,
    capabilities: extractCapabilities(tool),
    metadata: {
      version: tool.version || '1.0.0',
      category: categorizeResource(tool.name)
    }
  }));
}

export function createMcpProtocolAdapter(): McpProtocolAdapter {
  const protocolHandler = createProtocolHandler();

  return {
    async discoverTools(serverId) {
      try {
        // Send initialize message first
        await sendInitialize(serverId, protocolHandler);
        
        // Then list tools
        return await sendListTools(serverId, protocolHandler);
      } catch (error) {
        throw new Error(`Tool discovery failed for ${serverId}: ${(error as Error).message}`);
      }
    },

    async getToolSchema(serverId, toolName) {
      try {
        const tools = await sendListTools(serverId, protocolHandler);
        const tool = tools.find(t => t.name === toolName);
        
        if (!tool) {
          throw new Error(`Tool ${toolName} not found`);
        }

        return {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        };
      } catch (error) {
        throw new Error(`Failed to get schema for ${toolName}: ${(error as Error).message}`);
      }
    },

    async executeToolCall(serverId, toolName, parameters): Promise<ExecutionResult> {
      const executionId = generateId();
      const startedAt = new Date();
      
      try {
        const startTime = Date.now();
        
        // Execute the tool call
        const result = await sendCallTool(serverId, toolName, parameters, protocolHandler);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        const completedAt = new Date();

        return {
          id: executionId,
          toolName,
          serverId,
          status: 'completed' as ExecutionStatus,
          result,
          duration,
          startedAt,
          completedAt,
          metadata: {
            protocolVersion: '1.0',
            parameters
          }
        };
      } catch (error) {
        const duration = Date.now() - startedAt.getTime();
        return {
          id: executionId,
          toolName,
          serverId,
          status: 'failed' as ExecutionStatus,
          error: {
            code: 'EXECUTION_ERROR',
            message: (error as Error).message
          },
          duration,
          startedAt,
          completedAt: new Date(),
          metadata: {
            protocolVersion: '1.0',
            parameters
          }
        };
      }
    },

    sendInitialize: (serverId: string) => sendInitialize(serverId, protocolHandler),
    sendListTools: (serverId: string) => sendListTools(serverId, protocolHandler),
    sendCallTool: (serverId: string, name: string, args: any) => sendCallTool(serverId, name, args, protocolHandler)
  };
}

// AI-Native Pattern: External helper functions
async function sendInitialize(serverId: string, protocolHandler: any): Promise<void> {
  const message: ProtocolMessage = {
    id: generateId(),
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
    },
    timestamp: new Date()
  };

  await protocolHandler.sendMessage(message);
}

async function sendListTools(serverId: string, protocolHandler: any): Promise<ToolDefinition[]> {
  const message: ProtocolMessage = {
    id: generateId(),
    method: 'tools/list',
    params: {},
    timestamp: new Date()
  };

  await protocolHandler.sendMessage(message);
  
  // Mock response for now - in real implementation this would handle the response
  const mockTools: any[] = [];
  return transformToolList(mockTools, serverId);
}

async function sendCallTool(serverId: string, name: string, args: any, protocolHandler: any): Promise<any> {
  const message: ProtocolMessage = {
    id: generateId(),
    method: 'tools/call',
    params: {
      name,
      arguments: args || {}
    },
    timestamp: new Date()
  };

  await protocolHandler.sendMessage(message);
  
  // Mock response for now - in real implementation this would handle the response
  return { success: true, data: null };
}
