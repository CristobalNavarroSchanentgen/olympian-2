import { ReasoningBlock } from '../../../features/ui/reasoning-panel/contract';
/**
 * Reasoning Data Adapter
 *
 * Transforms raw reasoning data from various sources into structured blocks.
 * Under 100 lines, pure transformation logic.
 */
export declare class ReasoningDataAdapter {
    /**
     * Transform raw text reasoning into structured blocks
     */
    transformTextToBlocks(text: string, type?: ReasoningBlock['type']): Omit<ReasoningBlock, 'id' | 'timestamp' | 'stepNumber'>[];
    /**
     * Transform structured reasoning data from AI responses
     */
    transformAIReasoning(reasoning: any): Omit<ReasoningBlock, 'id' | 'timestamp' | 'stepNumber'>[];
    /**
     * Transform streaming reasoning updates
     */
    transformStreamingUpdate(update: string, existingContent?: string): Omit<ReasoningBlock, 'id' | 'timestamp' | 'stepNumber'>;
    /**
     * Clean and format reasoning content
     */
    cleanReasoningContent(content: string): string;
    private extractTitle;
    private estimateDuration;
}
//# sourceMappingURL=reasoning-data-adapter.d.ts.map