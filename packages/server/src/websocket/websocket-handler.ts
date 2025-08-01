import { Server as SocketIOServer, Socket } from 'socket.io';
import { ConversationService } from "@olympian/shared/services/conversation-service";
import { MessageService } from "@olympian/shared/services/message-service";
import { MessageRole } from "@olympian/shared/models/chat/message";
import { MCPManager } from '../mcp/mcp-manager-stub';
import { OllamaService } from '../services/ollama-service';
import { SmartModelRouter } from "@olympian/shared/features/chat/smart-model-router";
import { ModelRegistryService } from "@olympian/shared/services/model-registry-service";

export class WebSocketHandler {
  private io: SocketIOServer;
  private conversationService: ConversationService;
  private messageService: MessageService;
  private mcpManager: MCPManager;
  private ollamaService: OllamaService;
  private smartModelRouter: SmartModelRouter;
  private modelRegistryService: ModelRegistryService;

  constructor(
    io: SocketIOServer,
    conversationService: ConversationService,
    messageService: MessageService,
    mcpManager: MCPManager,
    ollamaService: OllamaService,
    smartModelRouter: SmartModelRouter,
    modelRegistryService: ModelRegistryService
  ) {
    this.io = io;
    this.conversationService = conversationService;
    this.messageService = messageService;
    this.mcpManager = mcpManager;
    this.ollamaService = ollamaService;
    this.smartModelRouter = smartModelRouter;
    this.modelRegistryService = modelRegistryService;
    
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('conversation:join', (conversationId: string) => {
        socket.join('conversation:' + conversationId);
        this.sendSystemStatus(socket);
      });

      socket.on('conversation:leave', (conversationId: string) => {
        socket.leave('conversation:' + conversationId);
      });

      socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
      socket.on('tool:execute', (data) => this.handleToolExecution(socket, data));
      socket.on('image:upload', (data) => this.handleImageUpload(socket, data));
      socket.on('status:request', () => this.sendSystemStatus(socket));
      socket.on('models:availability', () => this.handleModelsAvailability(socket));
      socket.on('models:list', () => this.handleModelsList(socket));
      socket.on('model:recommend', (data) => this.handleModelRecommendation(socket, data));
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async handleChatMessage(socket: Socket, data: {
    conversationId: string;
    content: string;
    images?: string[];
    userPreferences?: {
      preferredTextModel?: string;
      preferredVisionModel?: string;
    };
  }): Promise<void> {
    try {
      // Create user message
      const userMessage = await this.messageService.createMessage(
        data.conversationId,
        { content: data.content, role: "user" },
        "user"
      );
      this.io.to('conversation:' + data.conversationId).emit('chat:message', userMessage);

      // Use smart model router to select optimal model
      const routingResult = await this.smartModelRouter.routeMessage({
        content: data.content,
        images: data.images,
        userPreferences: data.userPreferences
      });

      socket.emit('model:selected', {
        model: routingResult.selectedModel,
        reason: routingResult.routingReason,
        capabilities: routingResult.modelCapabilities,
        fallbacks: routingResult.fallbacks
      });

      const assistantMessage = await this.messageService.createMessage(
        data.conversationId,
        { content: "", role: "assistant" },
        "assistant"
      );

      const chatRequest = {
        model: routingResult.selectedModel,
        messages: [{ role: 'user' as const, content: data.content }]
      };

      let fullResponse = '';
      let isFirstChunk = true;

      for await (const chunk of this.ollamaService.streamChat(chatRequest)) {
        if (chunk.message?.content) {
          fullResponse += chunk.message.content;
          
          socket.emit('chat:stream', {
            messageId: assistantMessage.id,
            content: chunk.message.content,
            metadata: { 
              streaming: true,
              selectedModel: routingResult.selectedModel,
              routingReason: routingResult.routingReason
            }
          });

          if (isFirstChunk) {
            socket.emit('chat:started', {
              messageId: assistantMessage.id,
              selectedModel: routingResult.selectedModel
            });
            isFirstChunk = false;
          }
        }
      }

      await this.messageService.updateMessage(assistantMessage.id, {
        content: fullResponse,
        metadata: { 
          streaming: false, 
          completed: true,
          selectedModel: routingResult.selectedModel,
          routingReason: routingResult.routingReason
        }
      });

      this.io.to('conversation:' + data.conversationId).emit('chat:complete', {
        messageId: assistantMessage.id,
        fullContent: fullResponse,
        selectedModel: routingResult.selectedModel
      });

      await this.conversationService.updateConversation(data.conversationId, {
        metadata: { 
          updatedAt: new Date().toISOString(),
          lastUsedModel: routingResult.selectedModel
        }
      });

    } catch (error) {
      console.error('Chat message error:', error);
      
      // Attempt fallback routing if available
      try {
        const fallbackResult = await this.smartModelRouter.handleRoutingFailure({
          failedModel: data.model || 'unknown',
          originalRequest: {
            content: data.content,
            images: data.images
          },
          error: error as Error
        });

        socket.emit('chat:fallback', {
          fallbackModel: fallbackResult.fallbackModel,
          strategy: fallbackResult.strategy,
          originalError: error instanceof Error ? error.message : 'Unknown error'
        });

        // Retry with fallback model - simplified version
        const chatRequest = {
          model: fallbackResult.fallbackModel,
          messages: [{ role: 'user' as const, content: data.content }]
        };

        const assistantMessage = await this.messageService.createMessage(
          data.conversationId,
          { content: "", role: "assistant" },
          "assistant"
        );

        let fullResponse = '';
        for await (const chunk of this.ollamaService.streamChat(chatRequest)) {
          if (chunk.message?.content) {
            fullResponse += chunk.message.content;
            socket.emit('chat:stream', {
              messageId: assistantMessage.id,
              content: chunk.message.content,
              metadata: { streaming: true, fallback: true }
            });
          }
        }

        await this.messageService.updateMessage(assistantMessage.id, {
          content: fullResponse,
          metadata: { streaming: false, completed: true, fallback: true }
        });

      } catch (fallbackError) {
        socket.emit('chat:error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          fallbackFailed: true
        });
      }
    }
  }

  private async handleToolExecution(socket: Socket, data: {
    serverName: string;
    toolName: string;
    arguments: any;
  }): Promise<void> {
    try {
      const result = await this.mcpManager.executeTool(
        data.serverName,
        data.toolName,
        data.arguments
      );

      socket.emit('tool:result', result);
    } catch (error) {
      socket.emit('tool:error', {
        error: error instanceof Error ? error.message : 'Tool execution failed'
      });
    }
  }

  private async handleImageUpload(socket: Socket, data: {
    conversationId: string;
    imageData: string;
    filename: string;
  }): Promise<void> {
    try {
      const imageBuffer = Buffer.from(data.imageData.split(',')[1], 'base64');
      
      socket.emit('image:uploaded', {
        success: true,
        filename: data.filename,
        size: imageBuffer.length
      });
    } catch (error) {
      socket.emit('image:error', {
        error: error instanceof Error ? error.message : 'Image upload failed'
      });
    }
  }

  private async sendSystemStatus(socket: Socket): Promise<void> {
    try {
      const mcpStatus = this.mcpManager.getServerStatus();
      const tools = this.mcpManager.getAllTools();
      const availableModels = await this.smartModelRouter.getAvailableModels();

      socket.emit('status:update', {
        mcp: {
          servers: mcpStatus,
          tools: tools.length
        },
        database: {
          connected: true
        },
        ollama: {
          connected: this.ollamaService.isConnected()
        },
        models: {
          available: availableModels.allModels.length,
          textModels: availableModels.textModels.length,
          visionModels: availableModels.visionModels.length,
          smartRouterActive: true
        }
      });
    } catch (error) {
      // Fallback to basic status if smart router fails
      const mcpStatus = this.mcpManager.getServerStatus();
      const tools = this.mcpManager.getAllTools();

      socket.emit('status:update', {
        mcp: {
          servers: mcpStatus,
          tools: tools.length
        },
        database: {
          connected: true
        },
        ollama: {
          connected: this.ollamaService.isConnected()
        },
        models: {
          smartRouterActive: false,
          error: error instanceof Error ? error.message : 'Model status unavailable'
        }
      });
    }
  }

  private async handleModelsList(socket: Socket): Promise<void> {
    try {
      const models = await this.modelRegistryService.getAllModels();
      socket.emit('models:list', {
        models,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      socket.emit('models:error', {
        error: error instanceof Error ? error.message : 'Failed to get models list'
      });
    }
  }

  private async handleModelRecommendation(socket: Socket, data: {
    content: string;
    images?: string[];
    requiredCapabilities?: ('vision' | 'tools' | 'reasoning')[];
  }): Promise<void> {
    try {
      // Analyze content to determine requirements
      const analysis = await this.smartModelRouter.analyzeContent({
        content: data.content,
        images: data.images
      });

      // Get recommendation based on analysis
      const recommendation = await this.smartModelRouter.getRecommendedModel({
        requiredCapabilities: data.requiredCapabilities || analysis.suggestedCapabilities,
        contentType: analysis.contentType,
        prioritizeSpeed: false
      });

      socket.emit('model:recommendation', {
        analysis,
        recommendation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      socket.emit('model:error', {
        error: error instanceof Error ? error.message : 'Failed to get model recommendation'
      });
    }
  }
    const mcpStatus = this.mcpManager.getServerStatus();
    const tools = this.mcpManager.getAllTools();

    socket.emit('status:update', {
      mcp: {
        servers: mcpStatus,
        tools: tools.length
      },
      database: {
        connected: true
      },
      ollama: {
        connected: this.ollamaService.isConnected()
      }
    });
  }
}
