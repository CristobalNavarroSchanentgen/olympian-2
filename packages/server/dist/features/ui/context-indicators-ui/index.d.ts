/**
 * CONTEXT INDICATORS UI IMPLEMENTATION
 */
import { ContextIndicatorsUIContract, ContextIndicator, ConversationMemoryState, ContextReference, TopicThread, ContextValidationResult } from './contract';
export declare class ContextIndicatorsUI implements ContextIndicatorsUIContract {
    private activeIndicators;
    private memoryState;
    displayMemoryStatus(memoryState: ConversationMemoryState): Promise<void>;
    showContextReferences(messageId: string, references: ContextReference[]): Promise<void>;
    displayTopicThreads(threads: TopicThread[]): Promise<void>;
    indicateContextContinuation(fromMessageId: string, toMessageId: string, continuationType: string): Promise<void>;
    showSummarizationIndicators(summarizedRange: {
        start: string;
        end: string;
    }, summary: string): Promise<void>;
    displayContextBuilding(messageId: string, contextSources: ContextIndicator[]): Promise<void>;
    updateContextIndicators(updates: Partial<ContextIndicator>[]): Promise<void>;
    handleContextOverflow(strategy: 'summarize' | 'truncate' | 'compress', affectedRange: {
        start: string;
        end: string;
    }): Promise<void>;
    provideContextualFeedback(messageId: string, intelligenceMetrics: any): Promise<void>;
    validateContextIndicators(): Promise<ContextValidationResult>;
    private renderMemoryStatus;
    private renderContextReferences;
    private renderTopicThreads;
    private renderContextContinuation;
    private renderSummarizationIndicator;
    private renderContextBuilding;
    private applyIndicatorUpdate;
    private renderContextOverflow;
    private renderContextualFeedback;
}
export declare function createContextIndicatorsUI(): ContextIndicatorsUI;
