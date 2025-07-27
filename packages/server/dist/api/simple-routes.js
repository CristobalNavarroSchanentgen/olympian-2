"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleRoutes = void 0;
exports.setupRoutes = setupRoutes;
const express_1 = require("express");
function setupRoutes(app) {
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
    // Model registry routes - temporarily disabled
    router.get('/models', async (req, res) => {
        res.json({
            mode: 'temporary',
            models: [],
            message: 'Model registry temporarily disabled'
        });
    });
    router.get('/models/capabilities', async (req, res) => {
        res.json({
            capabilities: [],
            message: 'Model registry temporarily disabled'
        });
    });
    app.use('/api', router);
}
exports.simpleRoutes = setupRoutes;
//# sourceMappingURL=simple-routes.js.map