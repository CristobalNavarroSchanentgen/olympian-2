"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    app.use('/api', router);
    console.log('📡 Simple API routes configured');
}
//# sourceMappingURL=simple-routes.js.map