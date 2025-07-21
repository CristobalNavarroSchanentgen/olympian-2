/**
 * Feature Contract: Chat Message Processor
 * 
 * Handles message processing, streaming, and communication with Ollama.
 */

import { Message } from '../../../models/chat/message';
import { MessageService, StreamingService } from '../../../services';
import { MessageSent, MessageReceived, TokensProcessed } from '../../../events';
import { MessageProcessorConfig } from '../../../config/features/chat/message-processor/schema';

export interface MessageProcessorContract {
  // === MESSAGE PROCESSING ===
  
  /**
   * Process user message and generate AI response
   */
  processMessage(params: {
    conversationId: string;
    content: string;
    images?: string[]; // base64 encoded images
    model: string;
    systemPrompt?: string;
    context?: Message[];
  }): Promise<{
    userMessage: Message;
    responseStream: AsyncIterableIterator<string>;
    responsePromise: Promise<Message>;
  }>;
  
  /**
   * Continue incomplete message processing
   */
  continueMessage(messageId: string): Promise<{
    responseStream: AsyncIterableIterator<string>;
    responsePromise: Promise<Message>;
  }>;
  
  /**
   * Cancel ongoing message processing
   */
  cancelMessage(messageId: string): Promise<void>;
  
  // === STREAMING ===
  
  /**
   * Start real-time message streaming
   */
  startStreaming(params: {
    conversationId: string;
    model: string;
    prompt: string;
    context?: Message[];
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    };
  }): Promise<{
    stream: AsyncIterableIterator<string>;
    messageId: string;
  }>;
  
  /**
   * Stop active streaming
   */
  stopStreaming(messageId: string): Promise<void>;
  
  // === MESSAGE MANAGEMENT ===
  
  /**
   * Regenerate AI response for existing message
   */
  regenerateResponse(messageId: string, newModel?: string): Promise<{
    responseStream: AsyncIterableIterator<string>;
    responsePromise: Promise<Message>;
  }>;
  
  /**
   * Edit user message and reprocess
   */
  editMessage(messageId: string, newContent: string): Promise<{
    updatedMessage: Message;
    responseStream: AsyncIterableIterator<string>;
    responsePromise: Promise<Message>;
  }>;
  
  // === VALIDATION & PROCESSING ===
  
  /**
   * Validate message content and images
   */
  validateMessage(content: string, images?: string[]): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  
  /**
   * Estimate token count for content
   */
  estimateTokens(content: string, images?: string[]): Promise<number>;
  
  // === CONFIGURATION ===
  
  updateConfig(config: Partial<MessageProcessorConfig>): Promise<void>;
  getConfig(): MessageProcessorConfig;
}

// === ADAPTER INTERFACES ===

export interface OllamaAdapter {
  generateResponse(params: {
    model: string;
    prompt: string;
    context?: Message[];
    images?: string[];
    options?: Record<string, unknown>;
  }): Promise<AsyncIterableIterator<string>>;
  
  validateModel(model: string): Promise<boolean>;
  estimateTokens(content: string, model: string): Promise<number>;
  cancelGeneration(requestId: string): Promise<void>;
}

export interface TokenCounterAdapter {
  countTokens(content: string, model?: string): number;
  estimateTokensWithImages(content: string, images: string[], model?: string): number;
  validateTokenBudget(messages: Message[], budget: number): boolean;
}

// === EVENT PUBLISHERS ===

export interface MessageEventPublisher {
  publishMessageSent(event: MessageSent): void;
  publishMessageReceived(event: MessageReceived): void;
  publishTokensProcessed(event: TokensProcessed): void;
}

// === EXTERNAL DEPENDENCIES ===

export interface MessageProcessorDependencies {
  messageService: MessageService;
  streamingService: StreamingService;
  ollamaAdapter: OllamaAdapter;
  tokenCounterAdapter: TokenCounterAdapter;
  eventPublisher: MessageEventPublisher;
  config: MessageProcessorConfig;
}
