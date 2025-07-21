/**
 * Feature Contract: Model Detector
 *
 * Detects and analyzes model capabilities through comprehensive testing.
 */
import { ModelCapability } from '../../../models/connection/model-capability';
import { DetectionService } from '../../../services/detection-service';
import { ModelsDetected, CapabilitiesUpdated } from '../../../events';
import { ModelDetectorConfig } from '../../../config/features/connection/model-detector/schema';
export interface ModelDetectorContract {
    /**
     * Perform comprehensive capability detection on model
     */
    detectCapabilities(modelName: string, options?: {
        methods?: number;
        timeout?: number;
        saveResults?: boolean;
    }): Promise<{
        capabilities: ModelCapability;
        testResults: Array<{
            method: string;
            success: boolean;
            confidence: number;
            duration: number;
            error?: string;
        }>;
        overallConfidence: number;
    }>;
    /**
     * Detect capabilities for all available models
     */
    detectAllModels(options?: {
        parallel?: boolean;
        skipKnown?: boolean;
        saveResults?: boolean;
    }): Promise<{
        results: Array<{
            model: string;
            capabilities: ModelCapability;
            success: boolean;
            error?: string;
        }>;
        totalTested: number;
        successfulDetections: number;
        duration: number;
    }>;
    /**
     * Quick capability check using cached results
     */
    quickCapabilityCheck(modelName: string): Promise<ModelCapability | null>;
    /**
     * Test vision capabilities with multiple methods
     */
    testVisionCapabilities(modelName: string): Promise<{
        hasVision: boolean;
        supportedFormats: string[];
        maxImageSize: number;
        multiImageSupport: boolean;
        testResults: Array<{
            method: string;
            format: string;
            success: boolean;
            responseQuality: number;
        }>;
    }>;
    /**
     * Generate test images for vision detection
     */
    generateTestImages(): Promise<Array<{
        format: string;
        data: string;
        expectedResponse: string;
        testType: string;
    }>>;
    /**
     * Get stored capabilities for model
     */
    getModelCapabilities(modelName: string): Promise<ModelCapability | null>;
    /**
     * Update model capabilities manually
     */
    updateCapabilities(modelName: string, capabilities: Partial<ModelCapability>): Promise<ModelCapability>;
    /**
     * Override capabilities with custom configuration
     */
    overrideCapabilities(overrides: Record<string, Partial<ModelCapability>>): Promise<{
        modelsUpdated: number;
        overridesApplied: number;
    }>;
    /**
     * Reset capabilities to detected values
     */
    resetCapabilities(modelName?: string): Promise<{
        modelsReset: number;
        capabilitiesCleared: number;
    }>;
    /**
     * Schedule periodic capability scanning
     */
    scheduleScanning(options?: {
        interval?: number;
        autoScanNew?: boolean;
        skipKnown?: boolean;
    }): Promise<void>;
    /**
     * Stop scheduled scanning
     */
    stopScanning(): Promise<void>;
    /**
     * Export capability data
     */
    exportCapabilities(format?: 'json' | 'csv'): Promise<{
        data: string;
        modelCount: number;
        exportTime: Date;
    }>;
    /**
     * Import capability data
     */
    importCapabilities(data: string, options?: {
        format?: 'json' | 'csv';
        overwrite?: boolean;
        validate?: boolean;
    }): Promise<{
        imported: number;
        skipped: number;
        errors: string[];
    }>;
    /**
     * Get detection statistics
     */
    getDetectionStats(): Promise<{
        totalModels: number;
        detectedModels: number;
        visionModels: number;
        textModels: number;
        lastScan: Date | null;
        averageConfidence: number;
    }>;
    updateConfig(config: Partial<ModelDetectorConfig>): Promise<void>;
    getConfig(): ModelDetectorConfig;
}
export interface CapabilityScannerAdapter {
    scanTextCapability(model: string): Promise<{
        hasTextGeneration: boolean;
        contextWindow: number;
        confidence: number;
    }>;
    scanVisionCapability(model: string, testImage: string): Promise<{
        hasVision: boolean;
        quality: number;
        formats: string[];
        confidence: number;
    }>;
    runDetectionMethod(method: string, model: string, params: Record<string, unknown>): Promise<{
        success: boolean;
        result: unknown;
        confidence: number;
    }>;
}
export interface ModelMetadataAdapter {
    extractModelInfo(modelName: string): {
        family: string;
        size: string;
        version: string;
        architecture: string;
    };
    inferCapabilities(modelName: string): Partial<ModelCapability>;
    applyHeuristics(modelName: string, testResults: unknown[]): ModelCapability;
}
export interface DetectionEventPublisher {
    publishModelsDetected(event: ModelsDetected): void;
    publishCapabilitiesUpdated(event: CapabilitiesUpdated): void;
}
export interface ModelDetectorDependencies {
    detectionService: DetectionService;
    capabilityScannerAdapter: CapabilityScannerAdapter;
    modelMetadataAdapter: ModelMetadataAdapter;
    eventPublisher: DetectionEventPublisher;
    config: ModelDetectorConfig;
}
//# sourceMappingURL=contract.d.ts.map