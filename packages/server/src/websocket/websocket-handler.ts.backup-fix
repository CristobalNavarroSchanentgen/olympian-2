import { Server as SocketIOServer, Socket } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MessageRole } from "@olympian/shared/models/chat/message";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { ModelRegistryService } from "@olympian/shared/services/model-registry-service";
import { OllamaService } from '../ollama/ollama-service';

export class WebSocketHandler {
  private io: SocketIOServer;
  private conversationService: ConversationService;
  private messageService: MessageService;
  private mcpManager: MCPManager;
  private ollamaService: OllamaService;
  private modelRegistryService: ModelRegistryService;

  constructor(
    io: SocketIOServer,
    conversationService: ConversationService,
    messageService: MessageService,
    mcpManager: MCPManager,
    ollamaService: OllamaService,
    modelRegistryService: ModelRegistryService
  ) {
    this.io = io;
    this.conversationService = conversationService;
    this.messageService = messageService;
    this.mcpManager = mcpManager;
    this.ollamaService = ollamaService;
    this.modelRegistryService = modelRegistryService;
    
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async handleChatMessage(socket: Socket, data: any): Promise<void> {
    try {
      const userMessage = await this.messageService.createMessage(
        data.conversationId,
        { content: data.content, role: "user" },
        "user"
      );
      
      socket.emit('chat:message', userMessage);
      socket.emit('chat:response', { content: 'Hello from simplified server!' });
      
    } catch (error) {
      socket.emit('chat:error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
