/**
 * MCP tool definition model - pure types only
 */

export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly schema: ToolSchema;
  readonly serverName: string;
}

export interface ToolSchema {
  readonly type: 'object';
  readonly properties: Record<string, PropertySchema>;
  readonly required?: string[];
  readonly additionalProperties?: boolean;
}

export interface PropertySchema {
  readonly type: JsonSchemaType;
  readonly description?: string;
  readonly enum?: unknown[];
  readonly items?: PropertySchema;
  readonly properties?: Record<string, PropertySchema>;
  readonly required?: string[];
  readonly default?: unknown;
}

export type JsonSchemaType = 
  | 'string' 
  | 'number' 
  | 'integer' 
  | 'boolean' 
  | 'array' 
  | 'object' 
  | 'null';

export interface ToolInvocation {
  readonly id: string;
  readonly name: string;
  readonly arguments: Record<string, unknown>;
  readonly serverName: string;
  readonly timestamp: Date;
}

export interface ToolRegistry {
  readonly tools: Record<string, ToolDefinition>;
  readonly serverTools: Record<string, string[]>;
  readonly lastUpdated: Date;
}
