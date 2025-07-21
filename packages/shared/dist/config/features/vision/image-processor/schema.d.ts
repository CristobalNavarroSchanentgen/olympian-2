/**
 * Configuration Schema: Vision Image Processor
 *
 * Validates configuration for image processing and vision capabilities.
 */
export interface ImageProcessorConfig {
    readonly upload: {
        readonly maxFileSize: number;
        readonly maxFiles: number;
        readonly allowedFormats: string[];
        readonly compressionEnabled: boolean;
    };
    readonly processing: {
        readonly maxDimensions: number;
        readonly quality: number;
        readonly autoResize: boolean;
        readonly preserveMetadata: boolean;
    };
    readonly validation: {
        readonly validateDimensions: boolean;
        readonly validateFormat: boolean;
        readonly validateContent: boolean;
        readonly allowAnimated: boolean;
    };
    readonly vision: {
        readonly hybridProcessing: boolean;
        readonly visionModelFallback: string;
        readonly maxRetries: number;
        readonly processingTimeout: number;
    };
}
export declare const imageProcessorDefaults: ImageProcessorConfig;
export declare function validateImageProcessorConfig(config: unknown): config is ImageProcessorConfig;
//# sourceMappingURL=schema.d.ts.map