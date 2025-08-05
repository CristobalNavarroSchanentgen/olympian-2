/**
 * Title Generation Service Implementation - Simplified
 */
import { TitleGenerationService } from '@olympian/shared/services/title-generation-service';
import { TitleGenerationRequest, TitleGenerationResponse, TitleGenerationConfig } from '@olympian/shared/models/chat/title-generation';
export declare class TitleGenerationServiceImpl implements TitleGenerationService {
    private config;
    generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse>;
    autoGenerateTitle(conversationId: string, firstMessage: string): Promise<string>;
    isAvailable(): Promise<boolean>;
    getConfig(): Promise<TitleGenerationConfig>;
    updateConfig(config: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig>;
    private extractTitle;
    private generateFallbackTitle;
}
