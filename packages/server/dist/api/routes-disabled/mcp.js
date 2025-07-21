"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpRoutes = mcpRoutes;
const express_1 = require("express");
function mcpRoutes(mcpManager) {
    const router = (0, express_1.Router)();
    // Get all MCP servers status
    router.get('/servers', (req, res) => {
        try {
            const status = mcpManager.getServerStatus();
            res.json(status);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get server status'
            });
        }
    });
    // Get all available tools
    router.get('/tools', (req, res) => {
        try {
            const tools = mcpManager.getAllTools();
            res.json(tools);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get tools'
            });
        }
    });
    // Execute a tool
    router.post('/tools/execute', async (req, res) => {
        try {
            const { serverName, toolName, arguments: args } = req.body;
            if (!serverName || !toolName) {
                return res.status(400).json({
                    error: 'serverName and toolName are required'
                });
            }
            const result = await mcpManager.executeTool(serverName, toolName, args || {});
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Tool execution failed'
            });
        }
    });
    // Restart MCP server
    router.post('/servers/:name/restart', async (req, res) => {
        try {
            await mcpManager.restartServer(req.params.name);
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to restart server'
            });
        }
    });
    // Stop MCP server
    router.post('/servers/:name/stop', async (req, res) => {
        try {
            await mcpManager.stopServer(req.params.name);
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to stop server'
            });
        }
    });
    return router;
}
//# sourceMappingURL=mcp.js.map