import { Router } from 'express';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';

export function setupOllamaRoutes(app: any, modelRegistryService: ModelRegistryService) {
  const router = Router();

  // GET /api/ollama/status - Get Ollama status
  router.get('/status', async (req, res) => {
    try {
      // Check if Ollama service is available
      // This would typically involve checking if Ollama is running on baseUrl
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      
      // TODO: Add actual health check to Ollama service
      const connected = true; // Would be result of actual health check
      
      res.json({
        connected,
        baseUrl,
        version: '0.1.0', // Would be retrieved from actual Ollama
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      res.status(503).json({ 
        connected: false,
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        error: 'Ollama service not available'
      });
    }
  });

  // GET /api/ollama/models - List available Ollama models
  router.get('/models', async (req, res) => {
    try {
      const models = await modelRegistryService.getAllRegisteredModels();
      console.log("🔍 API DEBUG: Total models from registry:", models.length);
      console.log("🔍 API DEBUG: All models:", models.map(m => ({ name: m.modelName, provider: m.provider, capabilities: m.capabilities })));      const ollamaModels = models.filter(model => model.provider === 'ollama');
      console.log("🔍 API DEBUG: Ollama filtered models:", ollamaModels.length);
      console.log("🔍 API DEBUG: Ollama models:", ollamaModels.map(m => ({ name: m.modelName, provider: m.provider })));      
      // Transform to match contract ModelInfo format using correct properties
      const formattedModels = ollamaModels.map(model => ({
        name: model.modelName,
        modified_at: new Date().toISOString(), // Default since no lastUpdated field
        size: model.maxTokens || 0, // Use maxTokens as size approximation
        digest: model.modelName, // Use modelName as digest fallback
        details: {
          format: 'gguf', // Default format for Ollama models
          family: model.displayName || model.name,
          parameter_size: model.contextLength ? `${model.contextLength}` : 'unknown',
          quantization_level: 'unknown' // Not available in current model definition
        }
      }));
      
      res.json({ 
        models: formattedModels,
        count: formattedModels.length 
      });
    } catch (error) {
      console.error('Error listing Ollama models:', error);
      res.status(500).json({ 
        models: [],
        count: 0,
        error: 'Failed to list Ollama models' 
      });
    }
  });

  app.use('/api/ollama', router);
}
