/**
 * Service Implementations Registry
 * Central registry for all service implementations
 */

import { ConversationServiceImpl } from './conversation-service-impl';
import { MessageServiceImpl } from './message-service-impl';
import { TitleGenerationServiceImpl } from './title-generation-service-impl';

import type { ConversationService } from '../conversation-service';
import type { MessageService } from '../message-service';
import type { TitleGenerationService } from '../title-generation-service';

// Service instances (singletons)
let conversationService: ConversationService | null = null;
let messageService: MessageService | null = null;
let titleGenerationService: TitleGenerationService | null = null;

/**
 * Get conversation service instance
 */
export function getConversationService(): ConversationService {
  if (!conversationService) {
    conversationService = new ConversationServiceImpl();
  }
  return conversationService;
}

/**
 * Get message service instance
 */
export function getMessageService(): MessageService {
  if (!messageService) {
    messageService = new MessageServiceImpl();
  }
  return messageService;
}

/**
 * Get title generation service instance
 */
export function getTitleGenerationService(): TitleGenerationService {
  if (!titleGenerationService) {
    titleGenerationService = new TitleGenerationServiceImpl();
  }
  return titleGenerationService;
}

/**
 * Initialize all services
 * Call this during application startup
 */
export function initializeServices(): void {
  // Initialize services
  getConversationService();
  getMessageService();
  getTitleGenerationService();
  
  console.log('✅ Services initialized');
}

/**
 * Export service implementations for testing
 */
export {
  ConversationServiceImpl,
  MessageServiceImpl,
  TitleGenerationServiceImpl
};
