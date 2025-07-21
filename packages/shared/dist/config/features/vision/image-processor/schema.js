"use strict";
/**
 * Configuration Schema: Vision Image Processor
 *
 * Validates configuration for image processing and vision capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageProcessorDefaults = void 0;
exports.validateImageProcessorConfig = validateImageProcessorConfig;
exports.imageProcessorDefaults = {
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        allowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
        compressionEnabled: true,
    },
    processing: {
        maxDimensions: 2048,
        quality: 85,
        autoResize: true,
        preserveMetadata: false,
    },
    validation: {
        validateDimensions: true,
        validateFormat: true,
        validateContent: false,
        allowAnimated: true,
    },
    vision: {
        hybridProcessing: true,
        visionModelFallback: 'llava',
        maxRetries: 2,
        processingTimeout: 45000,
    },
};
function validateImageProcessorConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.upload === 'object' &&
        typeof c.processing === 'object' &&
        typeof c.validation === 'object' &&
        typeof c.vision === 'object');
}
//# sourceMappingURL=schema.js.map