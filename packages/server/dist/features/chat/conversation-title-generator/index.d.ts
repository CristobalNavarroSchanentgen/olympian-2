/**
 * Conversation Title Generator Feature
 * Handles AI-powered conversation title generation
 */
import type { ConversationTitleGeneratorContract, TitleGenerationRequest, TitleGenerationResponse, TitleGenerationConfig } from './contract';
export declare class ConversationTitleGenerator implements ConversationTitleGeneratorContract {
    private config;
    private ollamaAdapter;
    private promptAdapter;
    constructor(ollamaAdapter: any, promptAdapter: any, initialConfig: TitleGenerationConfig);
    generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
    isEnabled(): Promise<boolean>;
    getConfig(): Promise<TitleGenerationConfig>;
    updateConfig(updates: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig>;
    private generateFallbackTitle;
}
export * from './contract';
