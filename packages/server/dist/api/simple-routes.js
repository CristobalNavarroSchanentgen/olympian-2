"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const express_1 = require("express");
function setupRoutes(app, modelRegistryService) {
    const router = (0, express_1.Router)();
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date() });
    });
    router.get('/status', (req, res) => {
        res.json({
            database: true,
            mcp: {},
            ollama: true,
            timestamp: new Date()
        });
    });
    router.get('/models', async (req, res) => {
        res.json({
            models: await modelRegistryService.getAllRegisteredModels(),
        });
    });
    router.get('/models/capabilities', async (req, res) => {
        res.json({
            capabilities: await modelRegistryService.getAllCapabilities(),
        });
    });
    app.use('/api', router);
}
//# sourceMappingURL=simple-routes.js.map