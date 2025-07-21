import { ExecutionResult } from '../../../models/mcp/execution-result';
/**
 * Result transformer adapter for MCP tool execution
 * Transforms execution results for tool-executor feature
 *
 * AI-Native Rule: This adapter is owned exclusively by tool-executor
 */
export interface ResultTransformerAdapter {
    transformToolResult(rawResult: any, context: TransformContext): ExecutionResult;
    transformError(error: any, context: TransformContext): ExecutionResult;
    processTextContent(content: string): ProcessedContent;
    processImageContent(content: any): ProcessedContent;
    processFileContent(content: any): ProcessedContent;
    formatForDisplay(result: ExecutionResult): DisplayResult;
    formatForLLM(result: ExecutionResult): string;
    extractArtifacts(result: ExecutionResult): ArtifactCandidate[];
}
export interface TransformContext {
    serverId: string;
    toolName: string;
    parameters: any;
    startTime: number;
}
export interface ProcessedContent {
    type: 'text' | 'image' | 'file' | 'json' | 'html' | 'markdown';
    content: string | any;
    metadata: {
        size: number;
        encoding?: string;
        mimeType?: string;
        truncated?: boolean;
    };
}
export interface DisplayResult {
    summary: string;
    content: ProcessedContent[];
    actions: ResultAction[];
    metadata: {
        executionTime: number;
        success: boolean;
        serverId: string;
        toolName: string;
    };
}
export interface ResultAction {
    type: 'download' | 'view' | 'copy' | 'save' | 'share';
    label: string;
    data: any;
}
export interface ArtifactCandidate {
    type: 'code' | 'document' | 'image' | 'data';
    title: string;
    content: string;
    language?: string;
    metadata: any;
}
export declare function createResultTransformerAdapter(): ResultTransformerAdapter;
//# sourceMappingURL=result-transformer-adapter.d.ts.map