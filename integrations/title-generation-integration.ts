/**
 * Title Generation Integration
 * Wires together the auto-title generation workflow
 */

import { MessageProcessor } from '../features/chat/message-processor';
import { ConversationManager } from '../features/chat/conversation-manager';
import { ConversationTitleGenerator } from '../features/chat/conversation-title-generator';
import { TitleGenerationServiceImpl } from '../services/implementations/title-generation-service-impl';

export interface IntegrationDependencies {
  // Event system
  eventEmitter: any;
  
  // External services (to be implemented)
  conversationServiceImpl: any;
  messageServiceImpl: any;
  
  // Adapters (existing)
  ollamaAdapter: any;
  promptAdapter: any;
  
  // Configuration
  titleGenerationConfig: any;
}

export function createTitleGenerationIntegration(deps: IntegrationDependencies) {
  // Create the title generator feature
  const titleGenerator = new ConversationTitleGenerator(
    deps.ollamaAdapter,
    deps.promptAdapter,
    deps.titleGenerationConfig
  );
  
  // Create the title generation service implementation
  const titleGenerationService = new TitleGenerationServiceImpl(titleGenerator);
  
  // Create conversation manager
  const conversationManager = new ConversationManager(
    deps.conversationServiceImpl,
    deps.eventEmitter
  );
  
  // Create message processor with title generation trigger
  const messageProcessor = new MessageProcessor(
    titleGenerationService,
    conversationManager,
    deps.messageServiceImpl,
    deps.eventEmitter
  );
  
  return {
    messageProcessor,
    conversationManager,
    titleGenerationService,
    titleGenerator
  };
}

/**
 * Example usage in server initialization:
 * 
 * const integration = createTitleGenerationIntegration({
 *   eventEmitter: eventBus,
 *   conversationServiceImpl: new DatabaseConversationService(),
 *   messageServiceImpl: new DatabaseMessageService(),
 *   ollamaAdapter: new OllamaAdapter(),
 *   promptAdapter: new PromptAdapter(),
 *   titleGenerationConfig: defaultTitleConfig
 * });
 * 
 * // Register with transport layer (WebSocket, HTTP)
 * registerMessageProcessor(integration.messageProcessor);
 * registerConversationManager(integration.conversationManager);
 */
