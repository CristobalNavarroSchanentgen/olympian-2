import { Server as SocketIOServer } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { TitleGenerationService } from "@olympian/shared/services/title-generation-service";
import { OllamaService } from '../services/ollama-service';
export declare class WebSocketHandler {
    private io;
    private conversationService;
    private messageService;
    private mcpManager;
    private ollamaService;
    private textModelSelector;
    private visionModelSelector;
    private titleGenerationService;
    constructor(io: SocketIOServer, conversationService: ConversationService, messageService: MessageService, mcpManager: MCPManager, ollamaService: OllamaService, textModelSelector: any, visionModelSelector: any, titleGenerationService: TitleGenerationService);
    private setupHandlers;
    private handleTextModelsRequest;
    private handleTextModelSelect;
    private handleVisionModelsRequest;
    private handleVisionModelSelect;
    private handleChatMessage;
}
