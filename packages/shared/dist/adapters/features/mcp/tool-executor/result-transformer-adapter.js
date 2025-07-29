"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResultTransformerAdapter = createResultTransformerAdapter;
// AI-Native Pattern: Helper functions extracted outside returned object
function processRawContent(rawResult) {
    if (rawResult === null || rawResult === undefined) {
        return 'No result returned';
    }
    if (typeof rawResult === 'string') {
        return rawResult;
    }
    if (typeof rawResult === 'object') {
        // Handle MCP-style responses
        if (rawResult.content && Array.isArray(rawResult.content)) {
            return rawResult.content.map((item) => {
                if (item.type === 'text')
                    return item.text;
                if (item.type === 'image')
                    return processImageContentHelper(item);
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
}
function processImageContentHelper(content) {
    if (typeof content === 'string') {
        // Base64 encoded image
        const size = Buffer.byteLength(content, 'base64');
        return {
            type: 'image',
            content,
            metadata: {
                size,
                encoding: 'base64',
                mimeType: detectImageMimeType(content)
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
                mimeType: detectImageMimeType(content.url)
            }
        };
    }
    return processTextContentHelper(JSON.stringify(content));
}
function processTextContentHelper(content) {
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
}
function detectResultType(result) {
    if (typeof result === 'string')
        return 'text';
    if (Array.isArray(result))
        return 'array';
    if (result && typeof result === 'object')
        return 'object';
    return 'primitive';
}
function calculateContentSize(content) {
    if (typeof content === 'string') {
        return Buffer.byteLength(content, 'utf8');
    }
    return Buffer.byteLength(JSON.stringify(content), 'utf8');
}
function hasImageContent(result) {
    const str = JSON.stringify(result).toLowerCase();
    return str.includes('image') || str.includes('base64') || str.includes('png') || str.includes('jpg');
}
function hasFileContent(result) {
    const str = JSON.stringify(result).toLowerCase();
    return str.includes('file') || str.includes('path') || str.includes('content');
}
function detectImageMimeType(content) {
    if (content.startsWith('data:image/')) {
        return content.substring(5, content.indexOf(';'));
    }
    const ext = content.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'webp': return 'image/webp';
        default: return 'image/unknown';
    }
}
function detectFileMimeType(path) {
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
}
function generateSummary(result) {
    if (result.status === 'failed') {
        return `${result.toolName} failed: ${result.error?.message || 'Unknown error'}`;
    }
    const executionTime = result.duration < 1000 ?
        `${result.duration}ms` :
        `${(result.duration / 1000).toFixed(1)}s`;
    return `${result.toolName} completed successfully in ${executionTime}`;
}
function generateActions(result) {
    const actions = [];
    if (result.status === 'completed' && result.result) {
        actions.push({
            type: 'copy',
            label: 'Copy Result',
            data: typeof result.result === 'string' ? result.result : JSON.stringify(result.result)
        });
        if (looksLikeCode(result.result) || looksLikeStructuredData(result.result)) {
            actions.push({
                type: 'save',
                label: 'Save as Artifact',
                data: result
            });
        }
    }
    return actions;
}
function looksLikeCode(content) {
    if (typeof content !== 'string')
        return false;
    const codeIndicators = [
        'function ', 'class ', 'import ', 'export ',
        'const ', 'let ', 'var ', '=> {',
        'def ', 'class ', 'import ', 'from ',
        '#include', 'using namespace',
        '<?php', '#!/'
    ];
    return codeIndicators.some(indicator => content.includes(indicator));
}
function looksLikeStructuredData(content) {
    if (typeof content !== 'string') {
        return typeof content === 'object' && content !== null;
    }
    try {
        JSON.parse(content);
        return true;
    }
    catch {
        return false;
    }
}
function looksLikeMarkdown(content) {
    if (typeof content !== 'string')
        return false;
    const markdownIndicators = ['# ', '## ', '### ', '- ', '* ', '1. ', '```', '**', '*', '[', ']('];
    return markdownIndicators.some(indicator => content.includes(indicator));
}
function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
function createResultTransformerAdapter() {
    return {
        transformToolResult(rawResult, context) {
            const endTime = Date.now();
            const duration = endTime - context.startTime;
            const startedAt = new Date(context.startTime);
            const completedAt = new Date(endTime);
            try {
                // Process the result based on its structure
                const processedContent = processRawContent(rawResult);
                return {
                    id: generateId(),
                    toolName: context.toolName,
                    serverId: context.serverId,
                    status: 'completed',
                    result: processedContent,
                    duration,
                    startedAt,
                    completedAt,
                    metadata: {
                        parameters: context.parameters,
                        resultType: detectResultType(rawResult),
                        contentSize: calculateContentSize(rawResult),
                        hasImages: hasImageContent(rawResult),
                        hasFiles: hasFileContent(rawResult),
                        processingVersion: '1.0.0'
                    }
                };
            }
            catch (error) {
                return {
                    id: generateId(),
                    toolName: context.toolName,
                    serverId: context.serverId,
                    status: 'failed',
                    error: {
                        code: 'TRANSFORM_ERROR',
                        message: error.message || 'Unknown error occurred',
                        details: {
                            stack: error.stack
                        }
                    },
                    duration,
                    startedAt,
                    completedAt,
                    metadata: {
                        parameters: context.parameters,
                        processingVersion: '1.0.0'
                    }
                };
            }
        },
        transformError(error, context) {
            const endTime = Date.now();
            const duration = endTime - context.startTime;
            const startedAt = new Date(context.startTime);
            const completedAt = new Date(endTime);
            return {
                id: generateId(),
                toolName: context.toolName,
                serverId: context.serverId,
                status: 'failed',
                error: {
                    code: error.code || 'EXECUTION_ERROR',
                    message: error.message || 'Unknown error occurred',
                    details: {
                        stack: error.stack
                    }
                },
                duration,
                startedAt,
                completedAt,
                metadata: {
                    parameters: context.parameters,
                    errorType: error.name || 'Error',
                    processingVersion: '1.0.0'
                }
            };
        },
        processTextContent(content) {
            return processTextContentHelper(content);
        },
        processImageContent(content) {
            return processImageContentHelper(content);
        },
        processFileContent(content) {
            if (content.path) {
                return {
                    type: 'file',
                    content: content.content || content.path,
                    metadata: {
                        size: content.size || 0,
                        mimeType: detectFileMimeType(content.path),
                        encoding: content.encoding || 'utf8'
                    }
                };
            }
            return processTextContentHelper(JSON.stringify(content));
        },
        formatForDisplay(result) {
            const content = [];
            if (result.status === 'completed' && result.result) {
                if (typeof result.result === 'string') {
                    content.push(processTextContentHelper(result.result));
                }
                else if (Array.isArray(result.result)) {
                    result.result.forEach((item, index) => {
                        content.push(processTextContentHelper(`Item ${index + 1}: ${JSON.stringify(item, null, 2)}`));
                    });
                }
                else {
                    content.push(processTextContentHelper(JSON.stringify(result.result, null, 2)));
                }
            }
            const summary = generateSummary(result);
            const actions = generateActions(result);
            return {
                summary,
                content,
                actions,
                metadata: {
                    executionTime: result.duration,
                    success: result.status === 'completed',
                    serverId: result.serverId,
                    toolName: result.toolName
                }
            };
        },
        formatForLLM(result) {
            if (result.status === 'failed') {
                return `Tool execution failed: ${result.error?.message || 'Unknown error'}`;
            }
            const header = `Tool: ${result.toolName} (${result.serverId})`;
            const timing = `Execution time: ${result.duration}ms`;
            let content = '';
            if (typeof result.result === 'string') {
                content = result.result;
            }
            else {
                content = JSON.stringify(result.result, null, 2);
            }
            // Truncate very long content for LLM consumption
            if (content.length > 10000) {
                content = content.substring(0, 10000) + '\n\n[Content truncated for brevity]';
            }
            return `${header}\n${timing}\n\nResult:\n${content}`;
        },
        extractArtifacts(result) {
            const artifacts = [];
            if (result.status !== 'completed' || !result.result) {
                return artifacts;
            }
            // Check for code content
            if (looksLikeCode(result.result)) {
                artifacts.push({
                    type: 'code',
                    title: `Code from ${result.toolName}`,
                    content: String(result.result),
                    language: detectCodeLanguage(result.result),
                    metadata: {
                        toolName: result.toolName,
                        serverId: result.serverId,
                        timestamp: result.completedAt
                    }
                });
            }
            // Check for structured data
            if (looksLikeStructuredData(result.result)) {
                artifacts.push({
                    type: 'data',
                    title: `Data from ${result.toolName}`,
                    content: JSON.stringify(result.result, null, 2),
                    metadata: {
                        toolName: result.toolName,
                        serverId: result.serverId,
                        timestamp: result.completedAt
                    }
                });
            }
            // Check for markdown content
            if (looksLikeMarkdown(result.result)) {
                artifacts.push({
                    type: 'document',
                    title: `Document from ${result.toolName}`,
                    content: String(result.result),
                    metadata: {
                        toolName: result.toolName,
                        serverId: result.serverId,
                        timestamp: result.completedAt
                    }
                });
            }
            return artifacts;
        }
    };
}
function detectCodeLanguage(content) {
    if (typeof content !== 'string')
        return 'text';
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('function ') || lowerContent.includes('const ') || lowerContent.includes('let ')) {
        return 'javascript';
    }
    if (lowerContent.includes('def ') || lowerContent.includes('import ')) {
        return 'python';
    }
    if (lowerContent.includes('class ') || lowerContent.includes('public ')) {
        return 'java';
    }
    if (lowerContent.includes('#include') || lowerContent.includes('using namespace')) {
        return 'cpp';
    }
    if (lowerContent.includes('<?php')) {
        return 'php';
    }
    return 'text';
}
//# sourceMappingURL=result-transformer-adapter.js.map