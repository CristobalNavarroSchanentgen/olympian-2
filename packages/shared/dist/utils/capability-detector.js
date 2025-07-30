/**
 * Capability Detector Utility
 * Pure functions for detecting model capabilities
 * Follows AI-Native architecture - utility functions only
 */
/**
 * Test a model's vision capabilities
 */
export async function testVisionCapability(modelEndpoint) {
    const startTime = Date.now();
    try {
        // This would be a real test in implementation
        const hasVision = await mockVisionTest(modelEndpoint);
        return {
            capability: 'vision',
            detected: hasVision,
            confidence: hasVision ? 0.95 : 0.05,
            metadata: {
                testType: 'vision_prompt',
                modelEndpoint
            },
            testDuration: Date.now() - startTime
        };
    }
    catch (error) {
        return {
            capability: 'vision',
            detected: false,
            confidence: 0,
            metadata: {
                error: error instanceof Error ? error.message : 'Unknown error',
                modelEndpoint
            },
            testDuration: Date.now() - startTime
        };
    }
}
/**
 * Test a model's code generation capabilities
 */
export async function testCodeCapability(modelEndpoint) {
    const startTime = Date.now();
    try {
        const hasCodeGen = await mockCodeTest(modelEndpoint);
        return {
            capability: 'code_generation',
            detected: hasCodeGen,
            confidence: hasCodeGen ? 0.9 : 0.1,
            metadata: {
                testType: 'code_prompt',
                modelEndpoint
            },
            testDuration: Date.now() - startTime
        };
    }
    catch (error) {
        return {
            capability: 'code_generation',
            detected: false,
            confidence: 0,
            metadata: {
                error: error instanceof Error ? error.message : 'Unknown error',
                modelEndpoint
            },
            testDuration: Date.now() - startTime
        };
    }
}
/**
 * Default detection methods for model capabilities
 */
export function getDefaultDetectionMethods() {
    return [
        {
            name: 'vision_test',
            priority: 1,
            testFunction: 'testVisionCapability',
            successCriteria: 'responds to image input'
        },
        {
            name: 'code_test',
            priority: 2,
            testFunction: 'testCodeCapability',
            successCriteria: 'generates valid code'
        }
    ];
}
/**
 * Combine detection results into capability summary
 */
export function summarizeCapabilities(results) {
    const capabilities = results.filter(r => r.detected).map(r => r.capability);
    const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    return {
        id: `capability_${Date.now()}`,
        modelName: 'detected_model',
        capabilities,
        confidence: averageConfidence,
        detectedAt: new Date(),
        metadata: {
            testResults: results,
            totalTests: results.length,
            successfulTests: results.filter(r => r.detected).length
        }
    };
}
// Mock test functions (would be replaced with real implementations)
async function mockVisionTest(endpoint) {
    // Simulate network call
    await new Promise(resolve => setTimeout(resolve, 100));
    return endpoint.includes('vision') || endpoint.includes('gpt-4');
}
async function mockCodeTest(endpoint) {
    // Simulate network call  
    await new Promise(resolve => setTimeout(resolve, 150));
    return endpoint.includes('code') || endpoint.includes('gpt') || endpoint.includes('claude');
}
/**
 * Main capability detection function - combines all detection methods
 */
export async function detectCapabilities(modelName, options) {
    const { endpoint, timeout = 30000, methods = [], testImage = false } = options;
    try {
        // Simulate detection process with the available test functions
        const results = [];
        // Test vision capability if requested
        if (methods.includes('vision-test') || testImage) {
            const visionResult = await testVisionCapability(endpoint);
            results.push(visionResult);
        }
        // Test code capability 
        if (methods.includes('test-chat') || methods.includes('parameter-analysis')) {
            const codeResult = await testCodeCapability(endpoint);
            results.push(codeResult);
        }
        // Basic detection from model name patterns
        const detectedCapabilities = ['text']; // Always has text
        let visionSupport = false;
        let streamingSupport = true; // Default to true
        // Vision detection
        if (results.some(r => r.capability === 'vision' && r.detected)) {
            detectedCapabilities.push('vision');
            visionSupport = true;
        }
        // Code detection
        if (results.some(r => r.capability === 'code_generation' && r.detected)) {
            detectedCapabilities.push('code');
        }
        // Infer family and size from model name
        const lowerName = modelName.toLowerCase();
        let family = 'unknown';
        let size = 'unknown';
        if (lowerName.includes('llama'))
            family = 'llama';
        else if (lowerName.includes('mistral'))
            family = 'mistral';
        else if (lowerName.includes('claude'))
            family = 'claude';
        else if (lowerName.includes('gpt'))
            family = 'gpt';
        if (lowerName.includes('7b'))
            size = '7b';
        else if (lowerName.includes('13b'))
            size = '13b';
        else if (lowerName.includes('70b'))
            size = '70b';
        // Estimate context window and max tokens based on family
        let contextWindow = 4096;
        let maxTokens = 2048;
        if (family === 'claude') {
            contextWindow = 200000;
            maxTokens = 4096;
        }
        else if (family === 'gpt' && lowerName.includes('gpt-4')) {
            contextWindow = 128000;
            maxTokens = 4096;
        }
        else if (lowerName.includes('32k')) {
            contextWindow = 32768;
            maxTokens = 8192;
        }
        const avgConfidence = results.length > 0
            ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length
            : 0.7;
        return {
            detected: detectedCapabilities,
            vision: visionSupport,
            streaming: streamingSupport,
            contextWindow,
            maxTokens,
            confidence: avgConfidence,
            methods: methods.filter(m => m !== 'unknown'),
            family,
            size,
            performance: {
                responseTime: results.reduce((sum, r) => sum + r.testDuration, 0),
                testCount: results.length
            }
        };
    }
    catch (error) {
        // Fallback detection
        return {
            detected: ['text'],
            vision: false,
            streaming: true,
            contextWindow: 4096,
            maxTokens: 2048,
            confidence: 0.1,
            methods: [],
            family: 'unknown',
            size: 'unknown',
            performance: {}
        };
    }
}
//# sourceMappingURL=capability-detector.js.map