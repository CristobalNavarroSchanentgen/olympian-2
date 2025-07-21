 MCP tool with parameters
   */
  executeTool(params: {
    toolName: string;
    arguments: Record<string, unknown>;
    serverId?: string;
    timeout?: number;
    requireConfirmation?: boolean;
  }): Promise<{
    executionId: string;
    result: ExecutionResult;
    duration: number;
    toolUsed: ToolDefinition;
  }>;
  
  /**
   * Execute multiple tools in sequence or parallel
   */
  executeTools(executions: Array<{
    toolName: string;
    arguments: Record<string, unknown>;
    serverId?: string;
  }>, options?: {
    parallel?: boolean;
    stopOnError?: boolean;
    timeout?: number;
  }): Promise<Array<{
    toolName: string;
    result: ExecutionResult;
    success: boolean;
    error?: string;
  }>>;
  
  /**
   * Cancel ongoing tool execution
   */
  cancelExecution(executionId: string): Promise<boolean>;
  
  // === EXECUTION MANAGEMENT ===
  
  /**
   * Get execution status and progress
   */
  getExecutionStatus(executionId: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    progress?: number;
    startTime: Date;
    endTime?: Date;
    result?: ExecutionResult;
  }>;
  
  /**
   * List recent executions with filtering
   */
  getExecutionHistory(options?: {
    toolName?: string;
    serverId?: string;
    limit?: number;
    status?: string;
    since?: Date;
  }): Promise<Array<{
    executionId: string;
    toolName: string;
    status: string;
    startTime: Date;
    duration: number;
    success: boolean;
  }>>;
  
  // === RESULT MANAGEMENT ===
  
  /**
   * Get cached execution result
   */
  getCachedResult(params: {
    toolName: string;
    arguments: Record<string, unknown>;
    maxAge?: number;
  }): Promise<ExecutionResult | null>;
  
  /**
   * Cache execution result for reuse
   */
  cacheResult(params: {
    toolName: string;
    arguments: Record<string, unknown>;
    result: ExecutionResult;
    ttl?: number;
  }): Promise<void>;
  
  /**
   * Clear cached results
   */
  clearCache(options?: {
    toolName?: string;
    olderThan?: Date;
  }): Promise<number>;
  
  // === SECURITY & VALIDATION ===
  
  /**
   * Validate tool arguments against schema
   */
  validateArguments(toolName: string, arguments: Record<string, unknown>): Promise<{
    isValid: boolean;
    errors: string[];
    sanitizedArgs: Record<string, unknown>;
  }>;
  
  /**
   * Check if tool execution is allowed
   */
  checkPermissions(toolName: string, arguments: Record<string, unknown>): Promise<{
    allowed: boolean;
    reason?: string;
    requiresConfirmation: boolean;
  }>;
  
  // === CONFIGURATION ===
  
  updateConfig(config: Partial<ToolExecutorConfig>): Promise<void>;
  getConfig(): ToolExecutorConfig;
}

// === ADAPTER INTERFACES ===

export interface McpProtocolAdapter {
  sendToolRequest(params: {
    serverId: string;
    toolName: string;
    arguments: Record<string, unknown>;
  }): Promise<ExecutionResult>;
  
  discoverServerTools(serverId: string): Promise<ToolDefinition[]>;
  validateConnection(serverId: string): Promise<boolean>;
  cancelRequest(serverId: string, requestId: string): Promise<void>;
}

export interface ResultTransformerAdapter {
  transformResult(result: unknown, toolDefinition: ToolDefinition): ExecutionResult;
  sanitizeResult(result: ExecutionResult): ExecutionResult;
  validateResult(result: ExecutionResult): { isValid: boolean; errors: string[] };
}

// === EVENT PUBLISHERS ===

export interface ToolEventPublisher {
  publishToolInvoked(event: ToolInvoked): void;
  publishToolCompleted(event: ToolCompleted): void;
  publishToolFailed(event: ToolFailed): void;
}

// === EXTERNAL DEPENDENCIES ===

export interface ToolExecutorDependencies {
  mcpProtocolAdapter: McpProtocolAdapter;
  resultTransformerAdapter: ResultTransformerAdapter;
  eventPublisher: ToolEventPublisher;
  config: ToolExecutorConfig;
}
