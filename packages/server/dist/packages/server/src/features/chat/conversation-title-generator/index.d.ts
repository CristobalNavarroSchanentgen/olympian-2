/**
 * Conversation Title Generator Implementation
 */
import { ConversationTitleGeneratorContract, TitleGenerationRequest, TitleGenerationResponse } from './contract';
export declare class ConversationTitleGenerator implements ConversationTitleGeneratorContract {
    private readonly maxTitleLength;
    private readonly minMessageLength;
    generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
    generateFallbackTitle(firstMessage: string): string;
    isValidForTitleGeneration(message: string): boolean;
    private cleanTitle;
}
export declare function createConversationTitleGenerator(): ConversationTitleGeneratorContract;
