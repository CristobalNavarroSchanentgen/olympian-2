import { ToolService } from '@olympian/shared/services/tool-service';
/**
 * Tool Service Implementation
 * Handles tool invocation and management
 */
export declare class ToolServiceImpl implements ToolService {
    private availableTools;
    constructor();
    invokeTool(toolName: string, params: any): Promise<any>;
    getAvailableTools(): Promise<string[]>;
    getToolDefinition(toolName: string): Promise<any>;
}
