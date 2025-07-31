"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupArtifactRoutes = setupArtifactRoutes;
const express_1 = require("express");
function setupArtifactRoutes(app, artifactService) {
    const router = (0, express_1.Router)();
    // GET /api/artifacts?conversationId=xxx - Get artifacts for a conversation
    router.get('/', async (req, res) => {
        try {
            const { conversationId } = req.query;
            if (!conversationId || typeof conversationId !== 'string') {
                return res.status(400).json({ error: 'conversationId query parameter is required' });
            }
            const artifacts = await artifactService.getConversationArtifacts(conversationId);
            res.json(artifacts);
        }
        catch (error) {
            console.error('Error getting artifacts:', error);
            res.status(500).json({ error: 'Failed to get artifacts' });
        }
    });
    // GET /api/artifacts/conversation/:conversationId - Get artifacts for a conversation (alternative route)
    router.get('/conversation/:conversationId', async (req, res) => {
        try {
            const { conversationId } = req.params;
            const artifacts = await artifactService.getConversationArtifacts(conversationId);
            res.json(artifacts);
        }
        catch (error) {
            console.error('Error getting artifacts:', error);
            res.status(500).json({ error: 'Failed to get artifacts' });
        }
    });
    // POST /api/artifacts - Create new artifact
    router.post('/', async (req, res) => {
        try {
            const { conversationId, title, type, content, metadata } = req.body;
            if (!conversationId || !title || !type || !content) {
                return res.status(400).json({
                    error: 'conversationId, title, type, and content are required'
                });
            }
            const artifact = await artifactService.createArtifact(conversationId, title, type, content, metadata);
            res.status(201).json({ artifact });
        }
        catch (error) {
            console.error('Error creating artifact:', error);
            res.status(500).json({ error: 'Failed to create artifact' });
        }
    });
    // GET /api/artifacts/:id - Get specific artifact
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const artifact = await artifactService.getArtifact(id);
            if (!artifact) {
                return res.status(404).json({ error: 'Artifact not found' });
            }
            res.json({ artifact });
        }
        catch (error) {
            console.error('Error getting artifact:', error);
            res.status(500).json({ error: 'Failed to get artifact' });
        }
    });
    // PUT /api/artifacts/:id - Update artifact
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, metadata } = req.body;
            const updates = { title, content, metadata };
            const artifact = await artifactService.updateArtifact(id, updates);
            res.json({ artifact });
        }
        catch (error) {
            console.error('Error updating artifact:', error);
            res.status(500).json({ error: 'Failed to update artifact' });
        }
    });
    // DELETE /api/artifacts/:id - Delete artifact
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await artifactService.deleteArtifact(id);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting artifact:', error);
            res.status(500).json({ error: 'Failed to delete artifact' });
        }
    });
    app.use('/api/artifacts', router);
}
//# sourceMappingURL=artifacts.js.map