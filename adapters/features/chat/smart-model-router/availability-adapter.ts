/**
 * Availability Adapter
 * Checks model health and availability status
 */

export interface AvailabilityAdapter {
  checkModelHealth(modelName: string): Promise<{
    available: boolean;
    healthy: boolean;
    responseTime?: number;
  }>;
  
  pingModel(modelName: string): Promise<number>; // response time in ms
}

export function createAvailabilityAdapter(ollamaBaseUrl: string = 'http://localhost:11434'): AvailabilityAdapter {
  return {
    async checkModelHealth(modelName: string) {
      try {
        const startTime = Date.now();
        
        // Check if model is available in Ollama
        const modelsResponse = await fetch(`${ollamaBaseUrl}/api/tags`);
        if (!modelsResponse.ok) {
          return { available: false, healthy: false };
        }
        
        const modelsData = await modelsResponse.json();
        const modelExists = modelsData.models?.some((m: any) => m.name === modelName);
        
        if (!modelExists) {
          return { available: false, healthy: false };
        }
        
        // Test model with a simple ping
        const responseTime = await this.pingModel(modelName);
        
        return {
          available: true,
          healthy: responseTime < 10000, // healthy if responds within 10s
          responseTime
        };
      } catch (error) {
        return { available: false, healthy: false };
      }
    },

    async pingModel(modelName: string): Promise<number> {
      try {
        const startTime = Date.now();
        
        const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            prompt: 'ping',
            stream: false,
            options: { 
              temperature: 0,
              max_tokens: 1
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`Model ping failed: ${response.status}`);
        }
        
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        throw new Error(`Failed to ping model ${modelName}: ${error}`);
      }
    }
  };
}
