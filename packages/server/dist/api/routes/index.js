"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const conversations_1 = require("./conversations");
const messages_1 = require("./messages");
const mcp_1 = require("./mcp");
const ollama_1 = require("./ollama");
const artifacts_1 = require("./artifacts");
function setupRoutes(app, dbService, mcpManager) {
    // Health check
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                mcp: mcpManager.getServerStatus().length > 0 ? 'running' : 'stopped'
            }
        });
    });
    // Feature routes
    app.use('/api/conversations', (0, conversations_1.conversationRoutes)(dbService));
    app.use('/api/messages', (0, messages_1.messageRoutes)(dbService));
    app.use('/api/mcp', (0, mcp_1.mcpRoutes)(mcpManager));
    app.use('/api/ollama', (0, ollama_1.ollamaRoutes)());
    app.use('/api/artifacts', (0, artifacts_1.artifactRoutes)(dbService));
}
//# sourceMappingURL=index.js.map