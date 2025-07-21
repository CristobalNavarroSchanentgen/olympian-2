import { spawn, ChildProcess } from 'child_process';
import { readFile } from 'fs/promises';
import { EventEmitter } from 'events';
import { MCPServerConfig, ToolDefinition, ExecutionResult } from '@olympian/shared';

interface MCPProcess {
  name: string;
  process: ChildProcess;
  config: MCPServerConfig;
  status: 'starting' | 'running' | 'stopped' | 'error';
  tools: ToolDefinition[];
}

export class MCPManager extends EventEmitter {
  private processes = new Map<string, MCPProcess>();
  private messageId = 0;
  private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();

  async initialize(): Promise<void> {
    try {
      const configData = await readFile('./mcp.config.json', 'utf-8');
      const config = JSON.parse(configData);
      
      for (const [serverName, serverConfig] of Object.entries(config.servers)) {
        await this.startServer(serverName, serverConfig as MCPServerConfig);
      }
      
      console.log(`🔧 Initialized ${this.processes.size} MCP servers`);
    } catch (error) {
      console.error('Failed to initialize MCP Manager:', error);
      throw error;
    }
  }

  async startServer(name: string, config: MCPServerConfig): Promise<void> {
    try {
      const process = spawn(config.command, config.args || [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          ...config.env
        }
      });

      const mcpProcess: MCPProcess = {
        name,
        process,
        config,
        status: 'starting',
        tools: []
      };

      this.processes.set(name, mcpProcess);

      // Handle process events
      process.on('error', (error) => {
        console.error(`MCP server ${name} error:`, error);
        mcpProcess.status = 'error';
        this.emit('server:error', name, error);
      });

      process.on('exit', (code) => {
        console.log(`MCP server ${name} exited with code ${code}`);
        mcpProcess.status = 'stopped';
        this.processes.delete(name);
        this.emit('server:stopped', name, code);
      });

      // Handle stdout for MCP protocol
      process.stdout?.on('data', (data) => {
        this.handleMCPMessage(name, data.toString());
      });

      // Send initialize request
      await this.sendMCPRequest(name, {
        jsonrpc: '2.0',
        id: this.getNextMessageId(),
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          clientInfo: {
            name: 'olympian-ai',
            version: '1.0.0'
          }
        }
      });

      mcpProcess.status = 'running';
      this.emit('server:started', name);

      // Discover tools
      await this.discoverTools(name);
      
    } catch (error) {
      console.error(`Failed to start MCP server ${name}:`, error);
      throw error;
    }
  }

  async stopServer(name: string): Promise<void> {
    const mcpProcess = this.processes.get(name);
    if (mcpProcess) {
      mcpProcess.process.kill();
      this.processes.delete(name);
    }
  }

  async restartServer(name: string): Promise<void> {
    const mcpProcess = this.processes.get(name);
    if (mcpProcess) {
      await this.stopServer(name);
      await this.startServer(name, mcpProcess.config);
    }
  }

  async discoverTools(serverName: string): Promise<ToolDefinition[]> {
    try {
      const response = await this.sendMCPRequest(serverName, {
        jsonrpc: '2.0',
        id: this.getNextMessageId(),
        method: 'tools/list',
        params: {}
      });

      const mcpProcess = this.processes.get(serverName);
      if (mcpProcess && response.result?.tools) {
        mcpProcess.tools = response.result.tools.map((tool: any) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          serverName
        }));
        
        this.emit('tools:discovered', serverName, mcpProcess.tools);
        return mcpProcess.tools;
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to discover tools for ${serverName}:`, error);
      return [];
    }
  }

  async executeTool(serverName: string, toolName: string, arguments_: any): Promise<ExecutionResult> {
    try {
      const response = await this.sendMCPRequest(serverName, {
        jsonrpc: '2.0',
        id: this.getNextMessageId(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: arguments_
        }
      });

      if (response.error) {
        return {
          success: false,
          error: response.error.message,
          toolName,
          serverName
        };
      }

      return {
        success: true,
        result: response.result?.content || response.result,
        toolName,
        serverName
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        toolName,
        serverName
      };
    }
  }

  getAllTools(): ToolDefinition[] {
    const allTools: ToolDefinition[] = [];
    for (const mcpProcess of this.processes.values()) {
      allTools.push(...mcpProcess.tools);
    }
    return allTools;
  }

  getServerStatus(): Array<{ name: string; status: string; toolCount: number }> {
    return Array.from(this.processes.values()).map(p => ({
      name: p.name,
      status: p.status,
      toolCount: p.tools.length
    }));
  }

  private async sendMCPRequest(serverName: string, request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const mcpProcess = this.processes.get(serverName);
      if (!mcpProcess || mcpProcess.status !== 'running') {
        reject(new Error(`Server ${serverName} not running`));
        return;
      }

      const id = request.id;
      this.pendingRequests.set(id, { resolve, reject });

      const message = JSON.stringify(request) + '\n';
      mcpProcess.process.stdin?.write(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request ${id} timed out`));
        }
      }, 30000);
    });
  }

  private handleMCPMessage(serverName: string, data: string): void {
    const lines = data.trim().split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const message = JSON.parse(line);
        
        if (message.id && this.pendingRequests.has(message.id)) {
          const { resolve } = this.pendingRequests.get(message.id)!;
          this.pendingRequests.delete(message.id);
          resolve(message);
        }
      } catch (error) {
        console.error(`Failed to parse MCP message from ${serverName}:`, error);
      }
    }
  }

  private getNextMessageId(): number {
    return ++this.messageId;
  }
}
