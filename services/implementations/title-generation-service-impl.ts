/**
 * Title Generation Service Implementation
 */

import type { TitleGenerationService } from '../title-generation-service';
import type { 
  TitleGenerationRequest, 
  TitleGenerationResponse, 
  TitleGenerationConfig 
} from '../../packages/shared/models/chat/title-generation';
import type { ConversationTitleGeneratorContract } from '../../features/chat/conversation-title-generator/contract';

export class TitleGenerationServiceImpl implements TitleGenerationService {
  private titleGenerator: ConversationTitleGeneratorContract;

  constructor(titleGenerator: ConversationTitleGeneratorContract) {
    this.titleGenerator = titleGenerator;
  }

  async generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse> {
    return this.titleGenerator.generateTitle(request);
  }

  async autoGenerateTitle(conversationId: string, firstMessage: string): Promise<string> {
    const request: TitleGenerationRequest = {
      conversationId,
      firstMessage,
      model: undefined // Will use default from config
    };

    const response = await this.titleGenerator.generateTitle(request);
    return response.generatedTitle;
  }

  async isAvailable(): Promise<boolean> {
    return this.titleGenerator.isEnabled();
  }

  async getConfig(): Promise<TitleGenerationConfig> {
    return this.titleGenerator.getConfig();
  }

  async updateConfig(config: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig> {
    return this.titleGenerator.updateConfig(config);
  }
}
