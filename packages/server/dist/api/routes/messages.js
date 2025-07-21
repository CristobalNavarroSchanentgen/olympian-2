"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = messageRoutes;
const express_1 = require("express");
function messageRoutes(dbService) {
    const router = (0, express_1.Router)();
    // Get messages for a conversation
    router.get('/conversation/:conversationId', async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const messages = await dbService.getMessages(req.params.conversationId, limit);
            res.json(messages);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get messages'
            });
        }
    });
    // Create new message
    router.post('/', async (req, res) => {
        try {
            const { conversationId, role, content, images, metadata = {} } = req.body;
            if (!conversationId || !role || !content) {
                return res.status(400).json({
                    error: 'conversationId, role, and content are required'
                });
            }
            const message = await dbService.createMessage({
                conversationId,
                role,
                content,
                images,
                metadata
            });
            res.status(201).json(message);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to create message'
            });
        }
    });
    // Update message
    router.put('/:id', async (req, res) => {
        try {
            const { content, metadata } = req.body;
            await dbService.updateMessage(req.params.id, {
                content,
                metadata
            });
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to update message'
            });
        }
    });
    // Delete message
    router.delete('/:id', async (req, res) => {
        try {
            await dbService.deleteMessage(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to delete message'
            });
        }
    });
    return router;
}
//# sourceMappingURL=messages.js.map