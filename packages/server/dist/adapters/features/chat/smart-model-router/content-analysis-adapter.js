"use strict";
/**
 * Content Analysis Adapter
 * Analyzes message content to determine model requirements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContentAnalysisAdapter = createContentAnalysisAdapter;
// Keywords that suggest different capabilities
const TOOL_KEYWORDS = [
    'calculate', 'compute', 'search', 'find', 'lookup', 'get', 'fetch',
    'analyze', 'parse', 'extract', 'process', 'convert', 'transform',
    'execute', 'run', 'call', 'invoke'
];
const REASONING_KEYWORDS = [
    'explain', 'why', 'how', 'reason', 'logic', 'think', 'analyze',
    'compare', 'contrast', 'evaluate', 'assess', 'judge', 'decide',
    'plan', 'strategy', 'approach', 'solve', 'problem', 'complex'
];
function createContentAnalysisAdapter() {
    return {
        async analyzeTextComplexity(content) {
            const words = content.toLowerCase().split(/\s+/);
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
            // Basic complexity metrics
            const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
            const hasToolKeywords = TOOL_KEYWORDS.some(keyword => content.toLowerCase().includes(keyword));
            const hasReasoningKeywords = REASONING_KEYWORDS.some(keyword => content.toLowerCase().includes(keyword));
            // Determine complexity
            let complexity = 'simple';
            if (avgWordsPerSentence > 20 || hasReasoningKeywords || words.length > 100) {
                complexity = 'complex';
            }
            else if (avgWordsPerSentence > 10 || hasToolKeywords || words.length > 50) {
                complexity = 'moderate';
            }
            // Suggest capabilities
            const suggestedCapabilities = [];
            if (hasToolKeywords)
                suggestedCapabilities.push('tools');
            if (hasReasoningKeywords)
                suggestedCapabilities.push('reasoning');
            return {
                complexity,
                suggestedCapabilities
            };
        },
        async detectImageContent(images) {
            return {
                hasImages: images.length > 0,
                requiresProcessing: images.length > 0 && images.some(img => img.length > 100) // basic validation
            };
        }
    };
}
//# sourceMappingURL=content-analysis-adapter.js.map