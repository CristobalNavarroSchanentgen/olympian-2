"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReasoningDataAdapter = void 0;
/**
 * Reasoning Data Adapter
 *
 * Transforms raw reasoning data from various sources into structured blocks.
 * Under 100 lines, pure transformation logic.
 */
class ReasoningDataAdapter {
    /**
     * Transform raw text reasoning into structured blocks
     */
    transformTextToBlocks(text, type = 'step') {
        if (!text || typeof text !== 'string') {
            return [];
        }
        // Split by double newlines or numbered lists
        const sections = text.split(/\n\n+|(?=\d+\.)/)
            .map(section => section.trim())
            .filter(section => section.length > 0);
        if (sections.length <= 1) {
            // Single block
            return [{
                    type,
                    title: this.extractTitle(text),
                    content: text,
                    duration: this.estimateDuration(text),
                }];
        }
        // Multiple blocks
        return sections.map(section => ({
            type,
            title: this.extractTitle(section),
            content: section,
            duration: this.estimateDuration(section),
        }));
    }
    /**
     * Transform structured reasoning data from AI responses
     */
    transformAIReasoning(reasoning) {
        if (!reasoning || typeof reasoning !== 'object') {
            return [];
        }
        const blocks = [];
        // Handle different AI reasoning formats
        if (reasoning.thinking) {
            blocks.push({
                type: 'planning',
                title: 'Thinking',
                content: reasoning.thinking,
                duration: this.estimateDuration(reasoning.thinking),
            });
        }
        if (reasoning.steps && Array.isArray(reasoning.steps)) {
            reasoning.steps.forEach((step, index) => {
                blocks.push({
                    type: 'step',
                    title: step.title || `Step ${index + 1}`,
                    content: step.content || step.description || String(step),
                    duration: step.duration || this.estimateDuration(step.content || String(step)),
                });
            });
        }
        if (reasoning.conclusion) {
            blocks.push({
                type: 'conclusion',
                title: 'Conclusion',
                content: reasoning.conclusion,
                duration: this.estimateDuration(reasoning.conclusion),
            });
        }
        return blocks;
    }
    /**
     * Transform streaming reasoning updates
     */
    transformStreamingUpdate(update, existingContent) {
        const fullContent = existingContent ? existingContent + update : update;
        return {
            type: 'step',
            title: this.extractTitle(fullContent),
            content: fullContent,
            duration: this.estimateDuration(fullContent),
        };
    }
    /**
     * Clean and format reasoning content
     */
    cleanReasoningContent(content) {
        if (!content || typeof content !== 'string') {
            return '';
        }
        return content
            .trim()
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\t/g, '  ')
            .replace(/^\d+\.\s*/, ''); // Remove leading numbers
    }
    extractTitle(content) {
        if (!content)
            return 'Reasoning';
        // Try to extract first line as title
        const firstLine = content.split('\n')[0].trim();
        // If first line looks like a title (short and ends with colon or is standalone)
        if (firstLine.length < 60 && (firstLine.endsWith(':') || content.includes('\n'))) {
            return firstLine.replace(/:$/, '');
        }
        // Extract from markdown headers
        const headerMatch = firstLine.match(/^#+\s*(.+)$/);
        if (headerMatch) {
            return headerMatch[1];
        }
        // Use first few words as title
        const words = firstLine.split(' ').slice(0, 8);
        return words.join(' ') + (words.length < firstLine.split(' ').length ? '...' : '');
    }
    estimateDuration(content) {
        if (!content)
            return 0;
        // Rough estimation: 100ms per word
        const wordCount = content.split(/\s+/).length;
        return Math.max(100, wordCount * 100);
    }
}
exports.ReasoningDataAdapter = ReasoningDataAdapter;
//# sourceMappingURL=reasoning-data-adapter.js.map