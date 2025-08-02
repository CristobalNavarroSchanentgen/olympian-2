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
      socket.on("text-models:request", () => this.handleTextModelsRequest(socket));
      socket.on("text-model:select", (data) => this.handleTextModelSelect(socket, data));
      socket.on("vision-models:request", () => this.handleVisionModelsRequest(socket));
      socket.on("vision-model:select", (data) => this.handleVisionModelSelect(socket, data));
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }


  private async handleTextModelsRequest(socket: Socket): Promise<void> {
    try {
      const models = await this.modelRegistryService.getAllModels();
      const textModels = models.filter(m => m.capabilities.includes("text-generation"));
      socket.emit("text-models:available", textModels);
    } catch (error) {
      socket.emit("model-selection-failed", {
        error: error instanceof Error ? error.message : "Failed to load text models",
        modelType: "text"
      });
    }
  }

  private async handleTextModelSelect(socket: Socket, data: { modelName: string }): Promise<void> {
    try {
      const validation = await this.modelRegistryService.validateModelAccess(data.modelName);
      if (!validation.allowed) {
        socket.emit("model-selection-failed", {
          error: validation.reason || "Model access denied",
          modelType: "text",
          attemptedModel: data.modelName
        });
        return;
      }

      socket.emit("text-model-selected", {
        modelName: data.modelName,
        reason: "User selection",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      socket.emit("model-selection-failed", {
        error: error instanceof Error ? error.message : "Failed to select model",
        modelType: "text",
        attemptedModel: data.modelName
      });
    }
  }

  private async handleVisionModelsRequest(socket: Socket): Promise<void> {
    try {
      const models = await this.modelRegistryService.getAllModels();
      const visionModels = models.filter(m => m.capabilities.includes("vision"));
      socket.emit("vision-models:available", visionModels);
    } catch (error) {
      socket.emit("model-selection-failed", {
        error: error instanceof Error ? error.message : "Failed to load vision models",
        modelType: "vision"
      });
    }
  }

  private async handleVisionModelSelect(socket: Socket, data: { modelName: string }): Promise<void> {
    try {
      const validation = await this.modelRegistryService.validateModelAccess(data.modelName);
      if (!validation.allowed) {
        socket.emit("model-selection-failed", {
          error: validation.reason || "Model access denied",
          modelType: "vision",
          attemptedModel: data.modelName
        });
        return;
      }

      socket.emit("vision-model-selected", {
        modelName: data.modelName,
        reason: "User selection",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      socket.emit("model-selection-failed", {
        error: error instanceof Error ? error.message : "Failed to select model",
        modelType: "vision",
        attemptedModel: data.modelName
      });
    }
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
