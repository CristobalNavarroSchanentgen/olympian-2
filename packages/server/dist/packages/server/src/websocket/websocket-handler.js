"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
class WebSocketHandler {
    io;
    conversationService;
    messageService;
    mcpManager;
    ollamaService;
    modelRegistryService;
    constructor(io, conversationService, messageService, mcpManager, ollamaService, modelRegistryService) {
        this.io = io;
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.mcpManager = mcpManager;
        this.ollamaService = ollamaService;
        this.modelRegistryService = modelRegistryService;
        this.setupHandlers();
    }
    setupHandlers() {
        this.io.on('connection', (socket) => {
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
    async selectBestAvailableModel(requestedModel) {
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
                    console.log(`? Model fallback: ${requestedModel} -> ${exactMatch}`);
                    return exactMatch;
                }
            }
            // Try to find the base model name in available models
            const baseModelName = requestedModel.split(':')[0];
            const similarModel = modelNames.find(name => name.startsWith(baseModelName));
            if (similarModel) {
                console.log(`? Model fallback: ${requestedModel} -> ${similarModel}`);
                return similarModel;
            }
            // Fall back to any text-capable model
            const textModels = await this.modelRegistryService.getAllModels();
            const availableTextModel = textModels.find(m => m.capabilities.includes("text-generation") &&
                modelNames.includes(m.name));
            if (availableTextModel) {
                console.log(`? Model fallback: ${requestedModel} -> ${availableTextModel.name}`);
                return availableTextModel.name;
            }
            // Last resort: use the first available model
            if (modelNames.length > 0) {
                console.log(`? Model fallback: ${requestedModel} -> ${modelNames[0]}`);
                return modelNames[0];
            }
            throw new Error('No models available');
        }
        catch (error) {
            console.error('Error selecting model:', error);
            throw new Error(`Failed to select model: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async handleTextModelsRequest(socket) {
        try {
            const models = await this.modelRegistryService.getAllModels();
            const textModels = models.filter(m => m.capabilities.includes("text-generation"));
            socket.emit("text-models:available", textModels);
        }
        catch (error) {
            socket.emit("model-selection-failed", {
                error: error instanceof Error ? error.message : "Failed to load text models",
                modelType: "text"
            });
        }
    }
    async handleTextModelSelect(socket, data) {
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
        }
        catch (error) {
            socket.emit("model-selection-failed", {
                error: error instanceof Error ? error.message : "Failed to select model",
                modelType: "text",
                attemptedModel: data.modelName
            });
        }
    }
    async handleVisionModelsRequest(socket) {
        try {
            const models = await this.modelRegistryService.getAllModels();
            const visionModels = models.filter(m => m.capabilities.includes("vision"));
            socket.emit("vision-models:available", visionModels);
        }
        catch (error) {
            socket.emit("model-selection-failed", {
                error: error instanceof Error ? error.message : "Failed to load vision models",
                modelType: "vision"
            });
        }
    }
    async handleVisionModelSelect(socket, data) {
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
        }
        catch (error) {
            socket.emit("model-selection-failed", {
                error: error instanceof Error ? error.message : "Failed to select model",
                modelType: "vision",
                attemptedModel: data.modelName
            });
        }
    }
    async handleChatMessage(socket, data) {
        try {
            // Create and store user message
            const userMessage = await this.messageService.createMessage(data.conversationId, { content: data.content, role: "user" }, "user");
            socket.emit('chat:message', userMessage);
            // Select the best available model
            const requestedModel = data.model || 'llama3.2:3b';
            const selectedModel = await this.selectBestAvailableModel(requestedModel);
            // Prepare chat request
            const chatRequest = {
                model: selectedModel,
                messages: [
                    {
                        role: 'user',
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
                const assistantMessage = await this.messageService.createMessage(data.conversationId, { content: fullResponse, role: "assistant" }, "assistant");
                socket.emit('chat:message', assistantMessage);
                socket.emit('chat:complete', {
                    responseTime: Date.now() - startTime,
                    model: selectedModel,
                    tokenCount: fullResponse.length // Rough approximation
                });
            }
            catch (streamError) {
                console.error('Chat message error:', streamError);
                socket.emit('chat:error', {
                    error: streamError instanceof Error ? streamError.message : 'Chat streaming failed'
                });
            }
        }
        catch (error) {
            console.error('Chat message error:', error);
            socket.emit('chat:error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.WebSocketHandler = WebSocketHandler;
//# sourceMappingURL=websocket-handler.js.map