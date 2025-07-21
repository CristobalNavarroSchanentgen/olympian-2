/**
 * Capability Detector Utility
 * Pure functions for detecting model capabilities
 * Follows AI-Native architecture - utility functions only
 */
import type { ModelCapability } from '../models/connection/model-capability';
/**
 * Detection method configuration
 */
export interface DetectionMethod {
    name: string;
    priority: number;
    testFunction: string;
    successCriteria: string;
}
/**
 * Detection result for a single capability
 */
export interface CapabilityDetectionResult {
    capability: string;
    detected: boolean;
    confidence: number;
    metadata: Record<string, unknown>;
    testDuration: number;
}
/**
 * Test a model's vision capabilities
 */
export declare function testVisionCapability(modelEndpoint: string): Promise<CapabilityDetectionResult>;
/**
 * Test a model's code generation capabilities
 */
export declare function testCodeCapability(modelEndpoint: string): Promise<CapabilityDetectionResult>;
/**
 * Default detection methods for model capabilities
 */
export declare function getDefaultDetectionMethods(): DetectionMethod[];
/**
 * Combine detection results into capability summary
 */
export declare function summarizeCapabilities(results: CapabilityDetectionResult[]): ModelCapability;
//# sourceMappingURL=capability-detector.d.ts.map