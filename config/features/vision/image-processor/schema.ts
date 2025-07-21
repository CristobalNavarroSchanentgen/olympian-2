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

export const imageProcessorDefaults: ImageProcessorConfig = {
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

export function validateImageProcessorConfig(
  config: unknown
): config is ImageProcessorConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.upload === 'object' &&
    typeof c.processing === 'object' &&
    typeof c.validation === 'object' &&
    typeof c.vision === 'object'
  );
}
