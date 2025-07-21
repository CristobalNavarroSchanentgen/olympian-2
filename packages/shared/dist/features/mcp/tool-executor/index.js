"use strict";
/**
 * Feature Implementation: MCP Tool Executor
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutor = void 0;
class ToolExecutor {
    deps;
    toolCache = new Map();
    executionQueue = new Map();
    constructor(deps) {
        this.deps = deps;
    }
    async discoverTools(serverName) {
        if (serverName) {
            return await this.discoverToolsFromServer(serverName);
        }
        // Discover from all running servers
        const allTools = [];
        const servers = await this.deps.mcpService.getRunningServers();
        for (const server of servers) {
            try {
                const tools = await this.discoverToolsFromServer(server.name);
                allTools.push(...tools);
            }
            catch (error) {
                console.error(`Failed to discover tools from ${server.name}:`, error);
            }
        }
        return allTools;
    }
    async discoverToolsFromServer(serverName) {
        const request = this.deps.protocolAdapter.createToolListRequest();
        const response = await this.deps.mcpService.sendRequest(serverName, request);
        const tools = this.deps.protocolAdapter.parseToolListResponse(response);
        // Cache tools
        tools.forEach(tool => {
            const key = `${serverName}:${tool.name}`;
            this.toolCache.set(key, { ...tool, serverName });
        });
        this.deps.eventPublisher.publishToolsDiscovered({
            serverName,
            tools: tools.map(t => t.name),
            timestamp: new Date()
        });
        return tools;
    }
    async executeTool(params) {
        const executionId = `${params.serverName}:${params.toolName}:${Date.now()}`;
        // Check if already executing
        if (this.executionQueue.has(executionId)) {
            return await this.executionQueue.get(executionId);
        }
        // Validate tool exists
        const toolKey = `${params.serverName}:${params.toolName}`;
        const tool = this.toolCache.get(toolKey);
        if (!tool) {
            throw new Error(`Tool not found: ${params.toolName} on ${params.serverName}`);
        }
        // Validate arguments
        this.validateToolArguments(tool, params.arguments);
        const executionPromise = this.executeToolInternal(params, executionId);
        this.executionQueue.set(executionId, executionPromise);
        try {
            const result = await executionPromise;
            return result;
        }
        finally {
            this.executionQueue.delete(executionId);
        }
    }
    async executeToolInternal(params, executionId) {
        const startTime = Date.now();
        try {
            // Create MCP request
            const request = this.deps.protocolAdapter.createToolCallRequest({
                name: params.toolName,
                arguments: params.arguments
            });
            // Execute with timeout
            const timeoutMs = params.timeout || this.deps.config.execution.defaultTimeout;
            const response = await Promise.race([
                this.deps.mcpService.sendRequest(params.serverName, request),
                this.createTimeoutPromise(timeoutMs)
            ]);
            // Parse response
            const result = this.deps.resultTransformer.transformResponse(response);
            const executionTime = Date.now() - startTime;
            const executionResult = {
                executionId,
                toolName: params.toolName,
                serverName: params.serverName,
                success: true,
                result: result.content,
                executionTime,
                timestamp: new Date()
            };
            this.deps.eventPublisher.publishToolInvoked({
                executionId,
                toolName: params.toolName,
                serverName: params.serverName,
                success: true,
                executionTime,
                timestamp: new Date()
            });
            return executionResult;
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            const executionResult = {
                executionId,
                toolName: params.toolName,
                serverName: params.serverName,
                success: false,
                error: error instanceof Error ? error.message : String(error),
                executionTime,
                timestamp: new Date()
            };
            this.deps.eventPublisher.publishToolInvoked({
                executionId,
                toolName: params.toolName,
                serverName: params.serverName,
                success: false,
                executionTime,
                timestamp: new Date(),
                error: executionResult.error
            });
            return executionResult;
        }
    }
    validateToolArguments(tool, args) {
        if (!tool.inputSchema)
            return;
        // Basic validation - in real implementation would use JSON schema validation
        const required = tool.inputSchema.required || [];
        for (const field of required) {
            if (!(field in args)) {
                throw new Error(`Missing required argument: ${field}`);
            }
        }
    }
    createTimeoutPromise(timeoutMs) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Tool execution timeout")), timeoutMs);
        });
    }
    async getExecutionHistory(limit) {
        return await this.deps.mcpService.getExecutionHistory(limit || 100);
    }
    async cancelExecution(executionId) {
        const execution = this.executionQueue.get(executionId);
        if (execution) {
            // Cancel the execution (implementation would depend on how promises are structured)
            this.executionQueue.delete(executionId);
        }
    }
    async getToolDefinition(serverName, toolName) {
        const key = `${serverName}:${toolName}`;
        return this.toolCache.get(key) || null;
    }
    async refreshToolCache() {
        this.toolCache.clear();
        await this.discoverTools();
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.ToolExecutor = ToolExecutor;
//# sourceMappingURL=index.js.map