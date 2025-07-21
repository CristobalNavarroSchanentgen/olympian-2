"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPManager = void 0;
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises");
const events_1 = require("events");
class MCPManager extends events_1.EventEmitter {
    processes = new Map();
    messageId = 0;
    pendingRequests = new Map();
    async initialize() {
        try {
            const configData = await (0, promises_1.readFile)('./mcp.config.json', 'utf-8');
            const config = JSON.parse(configData);
            for (const [serverName, serverConfig] of Object.entries(config.servers)) {
                await this.startServer(serverName, serverConfig);
            }
            console.log(`🔧 Initialized ${this.processes.size} MCP servers`);
        }
        catch (error) {
            console.error('Failed to initialize MCP Manager:', error);
            throw error;
        }
    }
    async startServer(name, config) {
        try {
            const childProcess = (0, child_process_1.spawn)(config.command, config.args || [], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    ...config.env
                }
            });
            const mcpProcess = {
                name,
                process: childProcess,
                config,
                status: 'starting',
                tools: []
            };
            this.processes.set(name, mcpProcess);
            // Handle process events
            childProcess.on('error', (error) => {
                console.error(`MCP server ${name} error:`, error);
                mcpProcess.status = 'error';
                this.emit('server:error', name, error);
            });
            childProcess.on('exit', (code) => {
                console.log(`MCP server ${name} exited with code ${code}`);
                mcpProcess.status = 'stopped';
                this.processes.delete(name);
                this.emit('server:stopped', name, code);
            });
            // Handle stdout for MCP protocol
            childProcess.stdout?.on('data', (data) => {
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
        }
        catch (error) {
            console.error(`Failed to start MCP server ${name}:`, error);
            throw error;
        }
    }
    async stopServer(name) {
        const mcpProcess = this.processes.get(name);
        if (mcpProcess) {
            mcpProcess.process.kill();
            this.processes.delete(name);
        }
    }
    async restartServer(name) {
        const mcpProcess = this.processes.get(name);
        if (mcpProcess) {
            await this.stopServer(name);
            await this.startServer(name, mcpProcess.config);
        }
    }
    async discoverTools(serverName) {
        try {
            const response = await this.sendMCPRequest(serverName, {
                jsonrpc: '2.0',
                id: this.getNextMessageId(),
                method: 'tools/list',
                params: {}
            });
            const mcpProcess = this.processes.get(serverName);
            if (mcpProcess && response.result?.tools) {
                mcpProcess.tools = response.result.tools.map((tool) => ({
                    name: tool.name,
                    description: tool.description,
                    inputSchema: tool.inputSchema,
                    serverName
                }));
                this.emit('tools:discovered', serverName, mcpProcess.tools);
                return mcpProcess.tools;
            }
            return [];
        }
        catch (error) {
            console.error(`Failed to discover tools for ${serverName}:`, error);
            return [];
        }
    }
    async executeTool(serverName, toolName, arguments_) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                toolName,
                serverName
            };
        }
    }
    getAllTools() {
        const allTools = [];
        for (const mcpProcess of this.processes.values()) {
            allTools.push(...mcpProcess.tools);
        }
        return allTools;
    }
    getServerStatus() {
        return Array.from(this.processes.values()).map(p => ({
            name: p.name,
            status: p.status,
            toolCount: p.tools.length
        }));
    }
    async sendMCPRequest(serverName, request) {
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
    handleMCPMessage(serverName, data) {
        const lines = data.trim().split('\n');
        for (const line of lines) {
            if (!line.trim())
                continue;
            try {
                const message = JSON.parse(line);
                if (message.id && this.pendingRequests.has(message.id)) {
                    const { resolve } = this.pendingRequests.get(message.id);
                    this.pendingRequests.delete(message.id);
                    resolve(message);
                }
            }
            catch (error) {
                console.error(`Failed to parse MCP message from ${serverName}:`, error);
            }
        }
    }
    getNextMessageId() {
        return ++this.messageId;
    }
}
exports.MCPManager = MCPManager;
//# sourceMappingURL=mcp-manager.js.map