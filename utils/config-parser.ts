/**
 * Configuration parsing utility - pure functions
 */

import { McpServerConfig, McpConfigFile } from '../models/mcp/server-config.js';

export interface ParseResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors: string[];
}

/**
 * Parse MCP configuration file
 */
export function parseMcpConfig(
  jsonContent: string
): ParseResult<McpConfigFile> {
  try {
    const data = JSON.parse(jsonContent) as any;
    const errors = validateMcpConfig(data);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    return {
      success: true,
      data: data as McpConfigFile,
      errors: []
    };
  } catch (error) {
    return {
      success: false,
      errors: [\`Invalid JSON: \${error instanceof Error ? error.message : 'Unknown error'}\`]
    };
  }
}

/**
 * Extract command arguments from server config
 */
export function extractCommandArgs(
  config: McpServerConfig
): { command: string; args: string[] } {
  const { command, args, runner } = config;
  
  switch (runner) {
    case 'npx':
      return {
        command: 'npx',
        args: [command, ...args]
      };
      
    case 'uv':
      return {
        command: 'uv',
        args: ['run', command, ...args]
      };
      
    case 'uvx':
      return {
        command: 'uvx',
        args: [command, ...args]
      };
      
    case 'node':
      return {
        command: 'node',
        args: [command, ...args]
      };
      
    case 'python':
      return {
        command: 'python',
        args: [command, ...args]
      };
      
    default:
      return { command, args };
  }
}

/**
 * Inject environment variables into config
 */
export function injectEnvironmentVars(
  config: McpServerConfig,
  globalEnv: Record<string, string> = {},
  processEnv: Record<string, string> = {}
): McpServerConfig {
  const mergedEnv = {
    ...globalEnv,
    ...config.env,
    ...processEnv
  };
  
  return {
    ...config,
    env: mergedEnv
  };
}

/**
 * Validate MCP configuration structure
 */
function validateMcpConfig(data: any): string[] {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Configuration must be an object');
    return errors;
  }
  
  if (!data.version || typeof data.version !== 'string') {
    errors.push('Missing or invalid version field');
  }
  
  if (!data.servers || typeof data.servers !== 'object') {
    errors.push('Missing or invalid servers field');
    return errors;
  }
  
  for (const [name, server] of Object.entries(data.servers)) {
    const serverErrors = validateServerConfig(name, server as any);
    errors.push(...serverErrors);
  }
  
  return errors;
}

function validateServerConfig(name: string, server: any): string[] {
  const errors: string[] = [];
  const prefix = \`Server '\${name}':\`;
  
  if (!server || typeof server !== 'object') {
    errors.push(\`\${prefix} must be an object\`);
    return errors;
  }
  
  if (!server.command || typeof server.command !== 'string') {
    errors.push(\`\${prefix} missing or invalid command\`);
  }
  
  if (!Array.isArray(server.args)) {
    errors.push(\`\${prefix} args must be an array\`);
  }
  
  if (server.runner && !['npx', 'uv', 'uvx', 'node', 'python'].includes(server.runner)) {
    errors.push(\`\${prefix} invalid runner type\`);
  }
  
  return errors;
}
