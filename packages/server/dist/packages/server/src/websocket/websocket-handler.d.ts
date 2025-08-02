import { Server as SocketIOServer } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { ModelRegistryService } from "@olympian/shared/services/model-registry-service";
import { OllamaService } from '../services/ollama-service';
export declare class WebSocketHandler {
    private io;
    private conversationService;
    private messageService;
    private mcpManager;
    private ollamaService;
    private modelRegistryService;
    constructor(io: SocketIOServer, conversationService: ConversationService, messageService: MessageService, mcpManager: MCPManager, ollamaService: OllamaService, modelRegistryService: ModelRegistryService);
    private setupHandlers;
    private selectBestAvailableModel;
    private handleTextModelsRequest;
    private handleTextModelSelect;
    private handleVisionModelsRequest;
    private handleVisionModelSelect;
    private handleChatMessage;
}
