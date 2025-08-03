/**
 * Title Generation Integration
 * Wires together the auto-title generation workflow
 */
import { MessageProcessor } from '../features/chat/message-processor';
import { ConversationManager } from '../features/chat/conversation-manager';
import { ConversationTitleGenerator } from '../features/chat/conversation-title-generator';
import { TitleGenerationServiceImpl } from '../services/implementations/title-generation-service-impl';
export interface IntegrationDependencies {
    eventEmitter: any;
    conversationServiceImpl: any;
    messageServiceImpl: any;
    ollamaAdapter: any;
    promptAdapter: any;
    titleGenerationConfig: any;
}
export declare function createTitleGenerationIntegration(deps: IntegrationDependencies): {
    messageProcessor: MessageProcessor;
    conversationManager: ConversationManager;
    titleGenerationService: TitleGenerationServiceImpl;
    titleGenerator: ConversationTitleGenerator;
};
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
