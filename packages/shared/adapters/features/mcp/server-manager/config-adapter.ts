import { ServerConfig } from '../../../../models/mcp';
import { parseConfig, validateConfig, ConfigParseResult } from '../../../../utils/config-parser';

/**
 * Config adapter for MCP server configuration
 * Transforms configuration utilities for server-manager feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */

export interface ConfigAdapter {
  // Configuration parsing
  parseServerConfig(configPath: string): Promise<ConfigParseResult>;
  parseInlineConfig(configData: any): ConfigParseResult;
  
  // Configuration validation
  validateServerConfig(config: ServerConfig): ValidationResult;
  validateAllConfigs(configs: ServerConfig[]): ValidationResult[];
  
  // Configuration transformation
  transformToRuntimeConfig(config: ServerConfig): RuntimeConfig;
  injectEnvironmentVariables(config: ServerConfig, env: Record<string, string>): ServerConfig;
  
  // Configuration management
  mergeConfigs(base: ServerConfig, override: Partial<ServerConfig>): ServerConfig;
  normalizeConfig(config: any): ServerConfig;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config?: ServerConfig;
}

export interface RuntimeConfig {
  name: string;
  command: string;
  args: string[];
  environment: Record<string, string>;
  workingDirectory?: string;
  timeout: number;
  retries: number;
  healthCheck: HealthCheckConfig;
}

export interface HealthCheckConfig {
  enabled: boolean;
  interval: number;
  timeout: number;
  retries: number;
}

export function createConfigAdapter(): ConfigAdapter {
  return {
    async parseServerConfig(configPath) {
      try {
        return await parseConfig(configPath);
      } catch (error) {
        return {
          success: false,
          data: undefined,
          errors: [{ message: `Failed to parse config file ${configPath}: ${(error instanceof Error ? error.message : String(error))}`, code: 'PARSE_ERROR' }],
          warnings: []
        };
      }
    },

    parseInlineConfig(configData) {
      try {
        const configs = Array.isArray(configData) ? configData : [configData];
        
        return {
          success: true,
          data: { configs, metadata: { source: 'inline', parsedAt: new Date() } },
          errors: [],
          warnings: []
        };
      } catch (error) {
        return {
          success: false,
          data: undefined,
          errors: [{ message: `Failed to parse inline config: ${(error instanceof Error ? error.message : String(error))}`, code: 'PARSE_ERROR' }],
          warnings: []
        };
      }
    },

    validateServerConfig(config) {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Required fields validation
      if (!config.name || typeof config.name !== 'string') {
        errors.push('Server name is required and must be a string');
      }

      if (!config.command || typeof config.command !== 'string') {
        errors.push('Server command is required and must be a string');
      }

      // Command-specific validation
      if (config.command === 'npx' && (!config.args || config.args.length === 0)) {
        errors.push('npx command requires package name in args');
      }

      if ((config.command === 'uv' || config.command === 'uvx') && (!config.args || config.args.length === 0)) {
        errors.push('uv/uvx command requires module name in args');
      }

      // Environment validation
      if (config.environment) {
        Object.entries(config.environment).forEach(([key, value]) => {
          if (typeof value !== 'string') {
            errors.push(`Environment variable ${key} must be a string`);
          }
        });
      }

      // Timeout validation
      if (config.timeout !== undefined && (typeof config.timeout !== 'number' || config.timeout <= 0)) {
        errors.push('Timeout must be a positive number');
      }

      // Working directory validation
      if (config.workingDirectory && typeof config.workingDirectory !== 'string') {
        errors.push('Working directory must be a string');
      }

      // Warnings for best practices
      if (config.command === 'npx' && !config.args?.includes('-y')) {
        warnings.push('Consider adding -y flag to npx for automatic package installation');
      }

      if (!config.environment || Object.keys(config.environment).length === 0) {
        warnings.push('No environment variables configured - some MCP servers may require API keys');
      }

      const valid = errors.length === 0;

      return {
        valid,
        errors,
        warnings,
        config: valid ? config : undefined
      };
    },

    validateAllConfigs(configs) {
      const results = configs.map(config => this.validateServerConfig(config));
      
      // Check for duplicate names
      const names = new Set<string>();
      results.forEach((result, index) => {
        if (result.config?.name) {
          if (names.has(result.config.name)) {
            result.errors.push(`Duplicate server name: ${result.config.name}`);
            result.valid = false;
          }
          names.add(result.config.name);
        }
      });

      return results;
    },

    transformToRuntimeConfig(config) {
      return {
        name: config.name,
        command: config.command,
        args: config.args || [],
        environment: config.environment || {},
        workingDirectory: config.workingDirectory,
        timeout: config.timeout || 30000,
        retries: config.retries || 3,
        healthCheck: {
          enabled: config.healthCheck?.enabled ?? true,
          interval: config.healthCheck?.interval || 30000,
          timeout: config.healthCheck?.timeout || 5000,
          retries: config.healthCheck?.retries || 2
        }
      };
    },

    injectEnvironmentVariables(config, env) {
      const newEnvironment = { ...config.environment };
      
      // Inject environment variables based on server type
      const serverType = this.detectServerType(config);
      
      switch (serverType) {
        case 'github':
          if (env.GITHUB_PERSONAL_ACCESS_TOKEN) {
            newEnvironment.GITHUB_PERSONAL_ACCESS_TOKEN = env.GITHUB_PERSONAL_ACCESS_TOKEN;
          }
          break;
          
        case 'nasa':
          if (env.NASA_API_KEY) {
            newEnvironment.NASA_API_KEY = env.NASA_API_KEY;
          }
          break;
          
        case 'context7':
          if (env.UPSTASH_REDIS_REST_URL) {
            newEnvironment.UPSTASH_REDIS_REST_URL = env.UPSTASH_REDIS_REST_URL;
          }
          if (env.UPSTASH_REDIS_REST_TOKEN) {
            newEnvironment.UPSTASH_REDIS_REST_TOKEN = env.UPSTASH_REDIS_REST_TOKEN;
          }
          break;
      }

      return {
        ...config,
        environment: newEnvironment
      };
    },

    mergeConfigs(base, override) {
      return {
        ...base,
        ...override,
        args: override.args || base.args,
        environment: {
          ...base.environment,
          ...override.environment
        },
        healthCheck: {
          ...base.healthCheck,
          ...override.healthCheck
        }
      };
    },

    normalizeConfig(config) {
      // Convert various config formats to standard ServerConfig
      const normalized: ServerConfig = {
        name: config.name || config.id || 'unnamed-server',
        command: config.command || config.cmd || 'npx',
        args: Array.isArray(config.args) ? config.args : 
              typeof config.args === 'string' ? config.args.split(' ') : [],
        environment: config.environment || config.env || {},
        workingDirectory: config.workingDirectory || config.cwd,
        timeout: config.timeout || 30000,
        retries: config.retries || 3,
        healthCheck: {
          enabled: config.healthCheck?.enabled ?? true,
          interval: config.healthCheck?.interval || 30000,
          timeout: config.healthCheck?.timeout || 5000,
          retries: config.healthCheck?.retries || 2
        }
      };

      return normalized;
    },

    // Helper methods
    extractServerConfigs(configData: any): ServerConfig[] {
      const configs: ServerConfig[] = [];
      
      if (configData.mcpServers) {
        // Standard MCP config format
        Object.entries(configData.mcpServers).forEach(([name, serverConfig]: [string, any]) => {
          configs.push(this.normalizeConfig({
            name,
            ...serverConfig
          }));
        });
      } else if (Array.isArray(configData)) {
        // Array of server configs
        configs.push(...configData.map(this.normalizeConfig));
      } else if (configData.name || configData.command) {
        // Single server config
        configs.push(this.normalizeConfig(configData));
      }

      return configs;
    },

    detectServerType(config: ServerConfig): string {
      const packageName = config.args?.[0] || '';
      
      if (packageName.includes('github')) return 'github';
      if (packageName.includes('nasa')) return 'nasa';
      if (packageName.includes('context7')) return 'context7';
      if (packageName.includes('metmuseum')) return 'met-museum';
      if (config.command === 'uvx' && packageName === 'basic-memory') return 'basic-memory';
      
      return 'unknown';
    }
  };
}
