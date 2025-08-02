/**
 * Configuration Schema for Conversation Title Generator
 */

import { TitleGenerationConfig } from '../../../../models/chat/title-generation';

export const defaultConfig: TitleGenerationConfig = {
  enabled: true,
  defaultModel: 'llama3.2:1b', // Use a lightweight model for title generation
  maxTitleLength: 50,
  minMessageLength: 5,
  temperature: 0.7
};

export * from '../../../../models/chat/title-generation';
