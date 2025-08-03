import { Server as SocketIOServer, Socket } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MessageRole } from "@olympian/shared/models/chat/message";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { ModelRegistryService } from "@olympian/shared/services/model-registry-service";
import { TitleGenerationService } from "@olympian/shared/services/title-generation-service";import { OllamaService } from '../services/ollama-service';

export class WebSocketHandler {
  private io: SocketIOServer;
  private conversationService: ConversationService;
  private messageService: MessageService;
  private mcpManager: MCPManager;
  private ollamaService: OllamaService;
  private modelRegistryService: ModelRegistryService;
  private titleGenerationService: TitleGenerationService;
  constructor(
    io: SocketIOServer,
    conversationService: ConversationService,
    messageService: MessageService,
    mcpManager: MCPManager,
    ollamaService: OllamaService,
    modelRegistryService: ModelRegistryService,
    titleGenerationService: TitleGenerationService  ) {
    this.io = io;
    this.conversationService = conversationService;
    this.messageService = messageService;
    this.mcpManager = mcpManager;
    this.ollamaService = ollamaService;
    this.modelRegistryService = modelRegistryService;
    this.titleGenerationService = titleGenerationService;    
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

  private async selectBestAvailableModel(requestedModel: string): Promise<string> {
    try {
      // First check if the exact model is available
      const models = await this.ollamaService.getModels();
      const modelNames = models.map(m => m.name);
      
      if (modelNames.includes(requestedModel)) {
        return requestedModel;
      }
      
      // Try without :latest suffix
      if (requestedModel.endsWith(':latest')) {
        const baseModel = requestedModel.replace(':latest', '');
        const exactMatch = modelNames.find(name => name.startsWith(baseModel + ':'));
        if (exactMatch) {
          console.log(`🔁 Model fallback: ${requestedModel} -> ${exactMatch}`);
          return exactMatch;
        }
      }
      
      // Try to find the base model name in available models
      const baseModelName = requestedModel.split(':')[0];
      const similarModel = modelNames.find(name => name.startsWith(baseModelName));
      if (similarModel) {
        console.log(`🔁 Model fallback: ${requestedModel} -> ${similarModel}`);
        return similarModel;
      }
      
      // Fall back to any text-capable model
      const textModels = await this.modelRegistryService.getAllModels();
      const availableTextModel = textModels.find(m => 
        m.capabilities.includes("text-generation") && 
        modelNames.includes(m.name)
      );
      
      if (availableTextModel) {
        console.log(`🔁 Model fallback: ${requestedModel} -> ${availableTextModel.name}`);
        return availableTextModel.name;
      }
      
      // Last resort: use the first available model
      if (modelNames.length > 0) {
        console.log(`🔁 Model fallback: ${requestedModel} -> ${modelNames[0]}`);
        return modelNames[0];
      }
      
      throw new Error('No models available');
    } catch (error) {
      console.error('Error selecting model:', error);
      throw new Error(`Failed to select model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async handleTextModelsRequest(socket: Socket): Promise<void> {
    console.log("🔍 DEBUG: Text models request received from client", socket.id);    try {
      // Force refresh models from Ollama to ensure we have the latest
      if ((this.modelRegistryService as any).forceRefresh) {
        await (this.modelRegistryService as any).forceRefresh();
      }
      const models = await this.modelRegistryService.getAllModels();
      console.log("🔍 DEBUG: Total models from registry:", models.length);
      console.log("🔍 DEBUG: All models:", models.map(m => ({ name: m.modelName, capabilities: m.capabilities })));      const textModels = models.filter(m => m.capabilities.includes("text-generation"));
      console.log(`📋 Sending ${textModels.length} text models to client`);
      console.log("🔍 DEBUG: Text models being sent:", textModels.map(m => ({ name: m.modelName, capabilities: m.capabilities, displayName: m.displayName })));      socket.emit("text-models:available", textModels);
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
      // Force refresh models from Ollama to ensure we have the latest
      if ((this.modelRegistryService as any).forceRefresh) {
        await (this.modelRegistryService as any).forceRefresh();
      }
      const models = await this.modelRegistryService.getAllModels();
      console.log("🔍 DEBUG: Total models from registry:", models.length);
      console.log("🔍 DEBUG: All models:", models.map(m => ({ name: m.modelName, capabilities: m.capabilities })));      const visionModels = models.filter(m => m.capabilities.includes("vision"));
      console.log(`📋 Sending ${visionModels.length} vision models to client`);
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
      // Create and store user message
      const userMessage = await this.messageService.createMessage(
        data.conversationId,
        { content: data.content, role: "user" },
        "user"
      );
      
      socket.emit('chat:message', userMessage);
      
      // Generate title if this is first user message
      this.handleTitleGeneration(data.conversationId, data.content);      
      // Select the best available model
      const requestedModel = data.model || 'llama3.2:3b';
      const selectedModel = await this.selectBestAvailableModel(requestedModel);
      
      // Prepare chat request
      const chatRequest = {
        model: selectedModel,
        messages: [
          {
            role: 'user' as const,
            content: data.content,
            ...(data.images && { images: data.images })
          }
        ],
        stream: true
      };
      
      // Start streaming response
      let fullResponse = '';
      const startTime = Date.now();
      
      try {
        for await (const chunk of this.ollamaService.streamChat(chatRequest)) {
          if (chunk.message?.content) {
            fullResponse += chunk.message.content;
            socket.emit('chat:stream', {
              content: chunk.message.content,
              done: chunk.done || false
            });
          }
          
          if (chunk.done) {
            break;
          }
        }
        
        // Create assistant message
        const assistantMessage = await this.messageService.createMessage(
          data.conversationId,
          { content: fullResponse, role: "assistant" },
          "assistant"
        );
        
        socket.emit('chat:message', assistantMessage);
        socket.emit('chat:complete', {
          responseTime: Date.now() - startTime,
          model: selectedModel,
          tokenCount: fullResponse.length // Rough approximation
        });
        
      } catch (streamError) {
        console.error('Chat message error:', streamError);
        socket.emit('chat:error', {
          error: streamError instanceof Error ? streamError.message : 'Chat streaming failed'
        });
      }
      
    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('chat:error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleTitleGeneration(conversationId: string, firstMessage: string): Promise<void> {
    try {
      const conversation = await this.conversationService.getConversation(conversationId);
      if (!conversation) return;
      
      if (conversation.title !== "New Chat" && conversation.title !== "Chat") {
        return;
      }
      
      const generatedTitle = await this.titleGenerationService.autoGenerateTitle(
        conversationId,
        firstMessage
      );
      
      await this.conversationService.updateConversation(conversationId, {
        title: generatedTitle
      });
      
      this.io.emit("conversation:title-updated", {
        conversationId,
        title: generatedTitle,
        timestamp: new Date().toISOString()
      });
      
      console.log("Generated title for conversation", conversationId, ":", generatedTitle);
      
    } catch (error) {
      console.error("Failed to generate conversation title:", error);
    }
  }}

