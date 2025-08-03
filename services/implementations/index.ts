/**
 * Service Implementations Registry
 * Central registry for all service implementations
 */

import { ConversationServiceImpl } from './conversation-service-impl';
import { MessageServiceImpl } from './message-service-impl';
import { TitleGenerationServiceImpl } from './title-generation-service-impl';
import { StreamingServiceImpl } from "../../packages/server/src/services/streaming-service-impl";
import { MemoryServiceImpl } from "../../packages/server/src/services/memory-service-impl";
import { ToolServiceImpl } from "../../packages/server/src/services/tool-service-impl";
import { LayoutServiceImpl } from "../../packages/server/src/services/layout-service-impl";import type { ConversationService } from '../conversation-service';
import type { MessageService } from '../message-service';
import type { TitleGenerationService } from '../title-generation-service';
import type { StreamingService } from "../streaming-service";
import type { MemoryService } from "../memory-service";
import type { ToolService } from "../tool-service";
import type { LayoutService } from "../layout-service";// Service instances (singletons)
let conversationService: ConversationService | null = null;
let messageService: MessageService | null = null;
let titleGenerationService: TitleGenerationService | null = null;
let streamingService: StreamingService | null = null;
let memoryService: MemoryService | null = null;
let toolService: ToolService | null = null;
let layoutService: LayoutService | null = null;/**
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
 * Get streaming service instance
 */
export function getStreamingService(): StreamingService {
  if (!streamingService) {
    streamingService = new StreamingServiceImpl();
  }
  return streamingService;}
}

/**
 * Get memory service instance
 */
export function getMemoryService(): MemoryService {
  if (!memoryService) {
    memoryService = new MemoryServiceImpl();
  }
  return memoryService;
}

/**
 * Get tool service instance
 */
export function getToolService(): ToolService {
  if (!toolService) {
    toolService = new ToolServiceImpl();
  }
  return toolService;
}

/**
 * Get layout service instance
 */
export function getLayoutService(): LayoutService {
  if (!layoutService) {
    layoutService = new LayoutServiceImpl();
  }
  return layoutService;
/**
 * Initialize all services
 * Call this during application startup
 */
export function initializeServices(): void {
  // Initialize services
  getConversationService();
  getMessageService();
  getTitleGenerationService();
  getStreamingService();  
  getMemoryService();
  getToolService();
  getLayoutService();  console.log('✅ Services initialized');
}

/**
 * Export service implementations for testing
 */
export {
  ConversationServiceImpl,
  MessageServiceImpl,
  TitleGenerationServiceImpl
  StreamingServiceImpl};
