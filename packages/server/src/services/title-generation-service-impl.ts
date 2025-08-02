/**
 * Title Generation Service Implementation - Simplified
 */

import { TitleGenerationService } from '@olympian/shared/services/title-generation-service';
import { TitleGenerationRequest, TitleGenerationResponse, TitleGenerationConfig } from '@olympian/shared/models/chat/title-generation';
import axios from 'axios';

export class TitleGenerationServiceImpl implements TitleGenerationService {
  private config: TitleGenerationConfig = {
    enabled: true,
    defaultModel: 'llama3.2:1b',
    maxTitleLength: 50,
    minMessageLength: 5,
    temperature: 0.7
  };

  async generateTitle(request: TitleGenerationRequest): Promise<TitleGenerationResponse> {
    if (!this.config.enabled || request.firstMessage.length < this.config.minMessageLength) {
      return {
        conversationId: request.conversationId,
        generatedTitle: this.generateFallbackTitle(request.firstMessage),
        fallbackUsed: true,
        model: request.model || this.config.defaultModel
      };
    }

    try {
      const prompt = `Generate a short, descriptive title (max 50 characters) for this conversation based on the user message. Only return the title, nothing else:\n\nUser: ${request.firstMessage.trim().substring(0, 200)}\n\nTitle:`;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: request.model || this.config.defaultModel,
        prompt,
        stream: false,
        options: {
          temperature: this.config.temperature,
          num_predict: 30,
          stop: ['\n', '.', '!', '?']
        }
      });

      const rawTitle = response.data.response || '';
      const title = this.extractTitle(rawTitle) || this.generateFallbackTitle(request.firstMessage);
      
      return {
        conversationId: request.conversationId,
        generatedTitle: title,
        fallbackUsed: !this.extractTitle(rawTitle),
        model: request.model || this.config.defaultModel,
        tokensUsed: response.data.eval_count || 0
      };
    } catch (error) {
      console.error('Title generation failed:', error);
      return {
        conversationId: request.conversationId,
        generatedTitle: this.generateFallbackTitle(request.firstMessage),
        fallbackUsed: true,
        model: request.model || this.config.defaultModel
      };
    }
  }

  async autoGenerateTitle(conversationId: string, firstMessage: string): Promise<string> {
    try {
      const result = await this.generateTitle({
        conversationId,
        firstMessage,
        model: this.config.defaultModel
      });
      return result.generatedTitle;
    } catch (error) {
      console.error('Auto title generation failed:', error);
      return this.generateFallbackTitle(firstMessage);
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.config.enabled;
  }

  async getConfig(): Promise<TitleGenerationConfig> {
    return { ...this.config };
  }

  async updateConfig(config: Partial<TitleGenerationConfig>): Promise<TitleGenerationConfig> {
    this.config = { ...this.config, ...config };
    return { ...this.config };
  }

  private extractTitle(response: string): string | null {
    if (!response) return null;

    let title = response.trim();
    
    // Remove common prefixes/suffixes
    title = title.replace(/^(title:|Title:|TITLE:)/i, '').trim();
    title = title.replace(/^[\"'\`]|[\"'\`]$/g, '').trim();
    
    // Remove newlines and extra spaces
    title = title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Ensure reasonable length (3-50 characters)
    if (title.length < 3 || title.length > 50) {
      return null;
    }
    
    // Check if it looks like a valid title (not a sentence/paragraph)
    if (title.includes('.') && title.length > 20) {
      const beforePeriod = title.split('.')[0].trim();
      if (beforePeriod.length >= 3 && beforePeriod.length <= 50) {
        title = beforePeriod;
      }
    }
    
    return title;
  }

  private generateFallbackTitle(message: string): string {
    const words = message.trim().split(/\s+/).slice(0, 5);
    const title = words.join(' ');
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  }
}
