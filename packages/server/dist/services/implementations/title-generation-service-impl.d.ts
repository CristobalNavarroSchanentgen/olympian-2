/**
 * Title Generation Service Implementation
 */
import type { TitleGenerationService } from '../title-generation-service';
import type { TitleGenerationRequest, TitleGenerationResponse, TitleGenerationConfig } from '../../packages/shared/models/chat/title-generation';
import type { ConversationTitleGeneratorContract } from '../../features/chat/conversation-title-generator/contract';
export declare class TitleGenerationServiceImpl implements TitleGenerationService {
    private titleGenerator;
    constructor(titleGenerator: ConversationTitleGeneratorContract);
    generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
    autoGenerateTitle(conversationId: string, firstMessage: string): Promise<string>;
    isAvailable(): Promise<boolean>;
    getConfig(): Promise<TitleGenerationConfig>;
    updateConfig(config: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig>;
}
