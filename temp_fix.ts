    detectOptimalSettings(capability: ModelCapability) {
      const settings: OptimalSettings = {
        contextWindow: capability.contextWindow || 4096,
        temperature: 0.7,
        maxTokens: Math.min(capability.maxTokens || 2048, (capability.contextWindow || 4096) * 0.3),
        stopSequences: [],
        streaming: capability.supportsStreaming || true
      };
      
      // Safe access to metadata properties
      const familyValue = capability.metadata?.family;
      const family = (typeof familyValue === 'string') ? familyValue.toLowerCase() : '';
      
      if (family.includes('llama')) {
        settings.temperature = 0.8;
        settings.stopSequences = ['### Human:', '### Assistant:'];
      }
      
      if (family.includes('mistral')) {
        settings.temperature = 0.7;
        settings.stopSequences = ['[INST]', '[/INST]'];
      }
      
      if (family.includes('claude')) {
        settings.temperature = 0.9;
        settings.maxTokens = Math.min(4096, (capability.contextWindow || 4096) * 0.5);
      }
      
      // Safe access to size property
      const sizeValue = capability.metadata?.size;
      const size = (typeof sizeValue === 'string') ? sizeValue : '';
      if (size.includes('7b') || size.includes('small')) {
        settings.maxTokens = Math.min(settings.maxTokens, 1024);
      }
      
      if (size.includes('70b') || size.includes('large')) {
        settings.maxTokens = Math.min(settings.maxTokens, 8192);
      }
      
      if (capability.supportsVision) {
        settings.maxTokens = Math.min(settings.maxTokens, 2048);
        settings.temperature = 0.7;
      }
      
      return settings;
    }
