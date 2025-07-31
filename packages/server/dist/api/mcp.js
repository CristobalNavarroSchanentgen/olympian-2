"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMcpRoutes = setupMcpRoutes;
const express_1 = require("express");
function setupMcpRoutes(app, mcpService) {
    const router = (0, express_1.Router)();
    // GET /api/mcp/servers - List all MCP servers
    router.get('/servers', async (req, res) => {
        try {
            const servers = await mcpService.listServers();
            res.json({ servers });
        }
        catch (error) {
            console.error('Error listing MCP servers:', error);
            res.status(500).json({ error: 'Failed to list MCP servers' });
        }
    });
    // POST /api/mcp/servers/:serverName/start - Start MCP server
    router.post('/servers/:serverName/start', async (req, res) => {
        try {
            const { serverName } = req.params;
            const success = await mcpService.startServer(serverName);
            if (success) {
                res.json({ success: true, message: `Server ${serverName} started` });
            }
            else {
                res.status(400).json({ success: false, message: `Failed to start server ${serverName}` });
            }
        }
        catch (error) {
            console.error('Error starting MCP server:', error);
            res.status(500).json({ error: 'Failed to start MCP server' });
        }
    });
    // POST /api/mcp/servers/:serverName/stop - Stop MCP server
    router.post('/servers/:serverName/stop', async (req, res) => {
        try {
            const { serverName } = req.params;
            const success = await mcpService.stopServer(serverName);
            if (success) {
                res.json({ success: true, message: `Server ${serverName} stopped` });
            }
            else {
                res.status(400).json({ success: false, message: `Failed to stop server ${serverName}` });
            }
        }
        catch (error) {
            console.error('Error stopping MCP server:', error);
            res.status(500).json({ error: 'Failed to stop MCP server' });
        }
    });
    // GET /api/mcp/tools - List available tools from all servers
    router.get('/tools', async (req, res) => {
        try {
            const tools = await mcpService.listTools();
            res.json({ tools });
        }
        catch (error) {
            console.error('Error listing MCP tools:', error);
            res.status(500).json({ error: 'Failed to list MCP tools' });
        }
    });
    // POST /api/mcp/tools/:toolName/execute - Execute MCP tool
    router.post('/tools/:toolName/execute', async (req, res) => {
        try {
            const { toolName } = req.params;
            const { arguments: args } = req.body;
            const result = await mcpService.executeTool(toolName, args || {});
            res.json({ result });
        }
        catch (error) {
            console.error('Error executing MCP tool:', error);
            res.status(500).json({ error: 'Failed to execute MCP tool' });
        }
    });
    app.use('/api/mcp', router);
}
//# sourceMappingURL=mcp.js.map