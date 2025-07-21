"use strict";
/**
 * Capability Detector Utility
 * Pure functions for detecting model capabilities
 * Follows AI-Native architecture - utility functions only
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testVisionCapability = testVisionCapability;
exports.testCodeCapability = testCodeCapability;
exports.getDefaultDetectionMethods = getDefaultDetectionMethods;
exports.summarizeCapabilities = summarizeCapabilities;
/**
 * Test a model's vision capabilities
 */
async function testVisionCapability(modelEndpoint) {
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
async function testCodeCapability(modelEndpoint) {
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
function getDefaultDetectionMethods() {
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
function summarizeCapabilities(results) {
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
//# sourceMappingURL=capability-detector.js.map