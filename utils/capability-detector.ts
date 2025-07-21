 * Default detection methods for model capabilities
 */
export function getDefaultDetectionMethods(): DetectionMethod[] {
  return [
    {
      name: 'vision_test',
      priority: 1,
      testFunction: 'testVisionCapability',
      successCriteria: 'responds to image input'
    },
    {
      name: 'streaming_test',
      priority: 2,
      testFunction: 'testStreamingCapability', 
      successCriteria: 'supports stream parameter'
    },
    {
      name: 'tool_test',
      priority: 3,
      testFunction: 'testToolCapability',
      successCriteria: 'supports function calling'
    },
    {
      name: 'context_test',
      priority: 4,
      testFunction: 'testContextWindow',
      successCriteria: 'handles large context'
    },
    {
      name: 'chat_test',
      priority: 5,
      testFunction: 'testChatCapability',
      successCriteria: 'basic chat response'
    },
    {
      name: 'parameter_test',
      priority: 6,
      testFunction: 'testParameterSupport',
      successCriteria: 'accepts temperature parameter'
    },
    {
      name: 'format_test',
      priority: 7,
      testFunction: 'testOutputFormat',
      successCriteria: 'structured output support'
    },
    {
      name: 'metadata_test',
      priority: 8,
      testFunction: 'testModelMetadata',
      successCriteria: 'returns model information'
    }
  ];
}

/**
 * Analyze test results to determine capabilities
 */
export function analyzeCapabilities(
  modelName: string,
  testResults: ModelTestResult[]
): DetectionResult {
  const successfulTests = testResults.filter(r => r.success);
  const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
  
  if (successfulTests.length === 0) {
    return {
      modelName,
      method: 'automated',
      success: false,
      error: 'All detection methods failed',
      duration: totalDuration
    };
  }
  
  const capabilities = buildCapabilitySet(successfulTests);
  
  return {
    modelName,
    method: 'automated',
    success: true,
    capabilities,
    duration: totalDuration
  };
}

/**
 * Build capability set from successful tests
 */
export function buildCapabilitySet(
  successfulTests: ModelTestResult[]
): CapabilitySet {
  const testNames = new Set(successfulTests.map(t => t.method));
  
  return {
    supportsChat: testNames.has('chat_test'),
    supportsVision: testNames.has('vision_test'),
    supportsStreaming: testNames.has('streaming_test'),
    supportsTools: testNames.has('tool_test'),
    contextWindow: estimateContextWindow(testNames),
    maxTokens: estimateMaxTokens(testNames)
  };
}

/**
 * Estimate context window size based on tests
 */
export function estimateContextWindow(testNames: Set<string>): number {
  if (testNames.has('context_test')) {
    // Assume large context if context test passed
    return 8192;
  }
  
  // Default conservative estimate
  return 2048;
}

/**
 * Estimate max tokens based on model capabilities
 */
export function estimateMaxTokens(testNames: Set<string>): number {
  if (testNames.has('context_test')) {
    return 4096;
  }
  
  return 1024;
}

/**
 * Prioritize detection methods by importance
 */
export function prioritizeDetectionMethods(
  methods: DetectionMethod[]
): DetectionMethod[] {
  return [...methods].sort((a, b) => a.priority - b.priority);
}

/**
 * Check if model name suggests specific capabilities
 */
export function inferCapabilitiesFromName(modelName: string): Partial<CapabilitySet> {
  const name = modelName.toLowerCase();
  const capabilities: Partial<CapabilitySet> = {};
  
  // Vision model indicators
  if (name.includes('vision') || name.includes('llava') || name.includes('bakllava')) {
    capabilities.supportsVision = true;
  }
  
  // Large context indicators
  if (name.includes('32k') || name.includes('128k') || name.includes('longcontext')) {
    capabilities.contextWindow = name.includes('128k') ? 131072 : 32768;
  }
  
  // Chat model indicators
  if (name.includes('chat') || name.includes('instruct')) {
    capabilities.supportsChat = true;
  }
  
  return capabilities;
}

/**
 * Validate capability override
 */
export function validateCapabilityOverride(
  override: Partial<CapabilitySet>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (override.contextWindow !== undefined) {
    if (override.contextWindow < 512 || override.contextWindow > 1000000) {
      errors.push('Context window must be between 512 and 1,000,000');
    }
  }
  
  if (override.maxTokens !== undefined) {
    if (override.maxTokens < 128 || override.maxTokens > 100000) {
      errors.push('Max tokens must be between 128 and 100,000');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Merge detected capabilities with overrides
 */
export function mergeCapabilities(
  detected: CapabilitySet,
  override: Partial<CapabilitySet>
): CapabilitySet {
  return {
    ...detected,
    ...override
  };
}

/**
 * Create default capability configuration
 */
export function createDefaultCapabilities(): CapabilitySet {
  return {
    supportsChat: true,
    supportsVision: false,
    supportsStreaming: true,
    supportsTools: false,
    contextWindow: 2048,
    maxTokens: 1024
  };
}
