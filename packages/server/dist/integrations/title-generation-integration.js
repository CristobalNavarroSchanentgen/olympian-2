"use strict";
/**
 * Title Generation Integration
 * Wires together the auto-title generation workflow
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTitleGenerationIntegration = createTitleGenerationIntegration;
const message_processor_1 = require("../features/chat/message-processor");
const conversation_manager_1 = require("../features/chat/conversation-manager");
const conversation_title_generator_1 = require("../features/chat/conversation-title-generator");
const title_generation_service_impl_1 = require("../services/implementations/title-generation-service-impl");
function createTitleGenerationIntegration(deps) {
    // Create the title generator feature
    const titleGenerator = new conversation_title_generator_1.ConversationTitleGenerator(deps.ollamaAdapter, deps.promptAdapter, deps.titleGenerationConfig);
    // Create the title generation service implementation
    const titleGenerationService = new title_generation_service_impl_1.TitleGenerationServiceImpl(titleGenerator);
    // Create conversation manager
    const conversationManager = new conversation_manager_1.ConversationManager(deps.conversationServiceImpl, deps.eventEmitter);
    // Create message processor with title generation trigger
    const messageProcessor = new message_processor_1.MessageProcessor(titleGenerationService, conversationManager, deps.messageServiceImpl, deps.eventEmitter);
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
//# sourceMappingURL=title-generation-integration.js.map