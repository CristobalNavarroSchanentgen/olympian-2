import { ExecutionResult } from '../../../models/mcp';

/**
 * Result transformer adapter for MCP tool execution
 * Transforms execution results for tool-executor feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by tool-executor
 */

export interface ResultTransformerAdapter {
  // Result transformation
  transformToolResult(rawResult: any, context: TransformContext): ExecutionResult;
  transformError(error: any, context: TransformContext): ExecutionResult;
  
  // Content processing
  processTextContent(content: string): ProcessedContent;
  processImageContent(content: any): ProcessedContent;
  processFileContent(content: any): ProcessedContent;
  
  // Result formatting
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

export function createResultTransformerAdapter(): ResultTransformerAdapter {
  return {
    transformToolResult(rawResult, context) {
      const endTime = Date.now();
      const executionTime = endTime - context.startTime;

      try {
        // Process the result based on its structure
        const processedContent = this.processRawContent(rawResult);
        
        return {
          success: true,
          result: processedContent,
          executionTime,
          serverId: context.serverId,
          toolName: context.toolName,
          parameters: context.parameters,
          timestamp: new Date(),
          metadata: {
            resultType: this.detectResultType(rawResult),
            contentSize: this.calculateContentSize(rawResult),
            hasImages: this.hasImageContent(rawResult),
            hasFiles: this.hasFileContent(rawResult),
            processingVersion: '1.0.0'
          }
        };
      } catch (error) {
        return this.transformError(error, context);
      }
    },

    transformError(error, context) {
      const endTime = Date.now();
      const executionTime = endTime - context.startTime;

      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        executionTime,
        serverId: context.serverId,
        toolName: context.toolName,
        parameters: context.parameters,
        timestamp: new Date(),
        metadata: {
          errorType: error.name || 'Error',
          stack: error.stack,
          processingVersion: '1.0.0'
        }
      };
    },

    processTextContent(content) {
      const text = String(content);
      const size = Buffer.byteLength(text, 'utf8');
      
      // Check if content should be truncated
      const maxSize = 100000; // 100KB limit
      const truncated = size > maxSize;
      const processedText = truncated ? text.substring(0, maxSize) + '...[truncated]' : text;

      return {
        type: 'text',
        content: processedText,
        metadata: {
          size,
          encoding: 'utf8',
          truncated
        }
      };
    },

    processImageContent(content) {
      if (typeof content === 'string') {
        // Base64 encoded image
        const size = Buffer.byteLength(content, 'base64');
        
        return {
          type: 'image',
          content,
          metadata: {
            size,
            encoding: 'base64',
            mimeType: this.detectImageMimeType(content)
          }
        };
      }
      
      if (content.url) {
        // Image URL
        return {
          type: 'image',
          content: content.url,
          metadata: {
            size: 0,
            mimeType: this.detectImageMimeType(content.url)
          }
        };
      }

      return this.processTextContent(JSON.stringify(content));
    },

    processFileContent(content) {
      if (content.path) {
        return {
          type: 'file',
          content: content.content || content.path,
          metadata: {
            size: content.size || 0,
            mimeType: this.detectFileMimeType(content.path),
            encoding: content.encoding || 'utf8'
          }
        };
      }

      return this.processTextContent(JSON.stringify(content));
    },

    formatForDisplay(result) {
      const content: ProcessedContent[] = [];
      
      if (result.success && result.result) {
        if (typeof result.result === 'string') {
          content.push(this.processTextContent(result.result));
        } else if (Array.isArray(result.result)) {
          result.result.forEach((item, index) => {
            content.push(this.processTextContent(`Item ${index + 1}: ${JSON.stringify(item, null, 2)}`));
          });
        } else {
          content.push(this.processTextContent(JSON.stringify(result.result, null, 2)));
        }
      }

      const summary = this.generateSummary(result);
      const actions = this.generateActions(result);

      return {
        summary,
        content,
        actions,
        metadata: {
          executionTime: result.executionTime,
          success: result.success,
          serverId: result.serverId,
          toolName: result.toolName
        }
      };
    },

    formatForLLM(result) {
      if (!result.success) {
        return `Tool execution failed: ${result.error}`;
      }

      const header = `Tool: ${result.toolName} (${result.serverId})`;
      const timing = `Execution time: ${result.executionTime}ms`;
      
      let content = '';
      if (typeof result.result === 'string') {
        content = result.result;
      } else {
        content = JSON.stringify(result.result, null, 2);
      }

      // Truncate very long content for LLM consumption
      if (content.length > 10000) {
        content = content.substring(0, 10000) + '\n\n[Content truncated for brevity]';
      }

      return `${header}\n${timing}\n\nResult:\n${content}`;
    },

    extractArtifacts(result) {
      const artifacts: ArtifactCandidate[] = [];

      if (!result.success || !result.result) {
        return artifacts;
      }

      // Check for code content
      if (this.looksLikeCode(result.result)) {
        artifacts.push({
          type: 'code',
          title: `Code from ${result.toolName}`,
          content: String(result.result),
          language: this.detectCodeLanguage(result.result),
          metadata: {
            toolName: result.toolName,
            serverId: result.serverId,
            timestamp: result.timestamp
          }
        });
      }

      // Check for structured data
      if (this.looksLikeStructuredData(result.result)) {
        artifacts.push({
          type: 'data',
          title: `Data from ${result.toolName}`,
          content: JSON.stringify(result.result, null, 2),
          metadata: {
            toolName: result.toolName,
            serverId: result.serverId,
            timestamp: result.timestamp
          }
        });
      }

      // Check for markdown content
      if (this.looksLikeMarkdown(result.result)) {
        artifacts.push({
          type: 'document',
          title: `Document from ${result.toolName}`,
          content: String(result.result),
          metadata: {
            toolName: result.toolName,
            serverId: result.serverId,
            timestamp: result.timestamp
          }
        });
      }

      return artifacts;
    },

    // Helper methods
    processRawContent(rawResult: any): any {
      if (rawResult === null || rawResult === undefined) {
        return 'No result returned';
      }

      if (typeof rawResult === 'string') {
        return rawResult;
      }

      if (typeof rawResult === 'object') {
        // Handle MCP-style responses
        if (rawResult.content && Array.isArray(rawResult.content)) {
          return rawResult.content.map((item: any) => {
            if (item.type === 'text') return item.text;
            if (item.type === 'image') return this.processImageContent(item);
            return item;
          }).join('\n');
        }

        if (rawResult.text) {
          return rawResult.text;
        }

        if (rawResult.data) {
          return rawResult.data;
        }

        return rawResult;
      }

      return String(rawResult);
    },

    detectResultType(result: any): string {
      if (typeof result === 'string') return 'text';
      if (Array.isArray(result)) return 'array';
      if (result && typeof result === 'object') return 'object';
      return 'primitive';
    },

    calculateContentSize(content: any): number {
      if (typeof content === 'string') {
        return Buffer.byteLength(content, 'utf8');
      }
      return Buffer.byteLength(JSON.stringify(content), 'utf8');
    },

    hasImageContent(result: any): boolean {
      const str = JSON.stringify(result).toLowerCase();
      return str.includes('image') || str.includes('base64') || str.includes('png') || str.includes('jpg');
    },

    hasFileContent(result: any): boolean {
      const str = JSON.stringify(result).toLowerCase();
      return str.includes('file') || str.includes('path') || str.includes('content');
    },

    detectImageMimeType(content: string): string {
      if (content.startsWith('data:image/')) {
        return content.substring(5, content.indexOf(';'));
      }
      
      const ext = content.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'png': return 'image/png';
        case 'jpg': case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'webp': return 'image/webp';
        default: return 'image/unknown';
      }
    },

    detectFileMimeType(path: string): string {
      const ext = path.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'txt': return 'text/plain';
        case 'json': return 'application/json';
        case 'html': return 'text/html';
        case 'css': return 'text/css';
        case 'js': return 'application/javascript';
        case 'pdf': return 'application/pdf';
        default: return 'application/octet-stream';
      }
    },

    generateSummary(result: ExecutionResult): string {
      if (!result.success) {
        return `${result.toolName} failed: ${result.error}`;
      }

      const executionTime = result.executionTime < 1000 ? 
        `${result.executionTime}ms` : 
        `${(result.executionTime / 1000).toFixed(1)}s`;

      return `${result.toolName} completed successfully in ${executionTime}`;
    },

    generateActions(result: ExecutionResult): ResultAction[] {
      const actions: ResultAction[] = [];

      if (result.success && result.result) {
        actions.push({
          type: 'copy',
          label: 'Copy Result',
          data: typeof result.result === 'string' ? result.result : JSON.stringify(result.result)
        });

        if (this.looksLikeCode(result.result) || this.looksLikeStructuredData(result.result)) {
          actions.push({
            type: 'save',
            label: 'Save as Artifact',
            data: result
          });
        }
      }

      return actions;
    },

    looksLikeCode(content: any): boolean {
      if (typeof content !== 'string') return false;
      
      const codeIndicators = [
        'function ', 'class ', 'import ', 'export ',
        'const ', 'let ', 'var ', '=> {',
        'def ', 'class ', 'import ', 'from ',
        '#include', 'using namespace',
        '<?php', '#!/'
      ];

      return codeIndicators.some(indicator => content.includes(indicator));
    },

    looksLikeStructuredData(content: any): boolean {
      if (typeof content !== 'string') {
        return typeof content === 'object' && content !== null;
      }

      try {
        JSON.parse(content);
        return true;
      } catch {
        return false;
      }
    },

    looksLikeMarkdown(content: any): boolean {
      if (typeof content !== 'string') return false;
      
      const markdownIndicators = ['# ', '## ', '### ', '- ', '* ', '1. ', '```', '**', '*', '[', ']('];
      return markdownIndicators.some(indicator => content.includes(indicator));
    }
  };
}
