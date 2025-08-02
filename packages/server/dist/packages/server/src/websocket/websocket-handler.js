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
            const userMessage = await this.messageService.createMessage(data.conversationId, { content: data.content, role: "user" }, "user");
            socket.emit('chat:message', userMessage);
            socket.emit('chat:response', { content: 'Hello from simplified server!' });
        }
        catch (error) {
            socket.emit('chat:error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.WebSocketHandler = WebSocketHandler;
//# sourceMappingURL=websocket-handler.js.map