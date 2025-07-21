/**
 * Feature Contract: Vision Image Processor
 * 
 * Handles image upload, processing, and vision model integration.
 */

import { ImageData, ProcessingResult } from '../../../models/vision';
import { ImageUploaded, ImageProcessed } from '../../../events';
import { ImageProcessorConfig } from '../../../config/features/vision/image-processor/schema';

export interface ImageProcessorContract {
  // === IMAGE UPLOAD ===
  
  /**
   * Process uploaded images for vision models
   */
  processUpload(params: {
    files: Array<{
      data: Buffer | string; // raw data or base64
      filename: string;
      mimetype: string;
      size: number;
    }>;
    options?: {
      resize?: boolean;
      compress?: boolean;
      validateContent?: boolean;
    };
  }): Promise<{
    images: ImageData[];
    totalSize: number;
    processingTime: number;
    warnings: string[];
  }>;
  
  /**
   * Validate image before processing
   */
  validateImage(params: {
    data: Buffer | string;
    filename: string;
    mimetype: string;
    size: number;
  }): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    metadata: {
      width: number;
      height: number;
      format: string;
      hasAlpha: boolean;
    };
  }>;
  
  // === IMAGE PROCESSING ===
  
  /**
   * Resize image to optimal dimensions
   */
  resizeImage(params: {
    imageData: string; // base64
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    preserveAspectRatio?: boolean;
  }): Promise<{
    processedImage: string; // base64
    originalSize: { width: number; height: number };
    newSize: { width: number; height: number };
    compressionRatio: number;
  }>;
  
  /**
   * Convert image format
   */
  convertFormat(params: {
    imageData: string; // base64
    fromFormat: string;
    toFormat: string;
    quality?: number;
  }): Promise<{
    convertedImage: string; // base64
    originalSize: number;
    newSize: number;
    conversionTime: number;
  }>;
  
  /**
   * Optimize images for vision models
   */
  optimizeForVision(params: {
    images: ImageData[];
    targetModel: string;
    maxTotalSize?: number;
  }): Promise<{
    optimizedImages: ImageData[];
    totalSizeReduction: number;
    optimizationApplied: string[];
  }>;
  
  // === VISION INTEGRATION ===
  
  /**
   * Process images with vision model
   */
  processWithVision(params: {
    images: ImageData[];
    model: string;
    prompt: string;
    hybridMode?: boolean;
    fallbackModel?: string;
  }): Promise<{
    result: ProcessingResult;
    modelUsed: string;
    processingTime: number;
    tokensUsed: number;
  }>;
  
  /**
   * Analyze image content without prompt
   */
  analyzeImage(params: {
    image: ImageData;
    analysisType: 'description' | 'objects' | 'text' | 'scene';
    model?: string;
  }): Promise<{
    analysis: {
      description?: string;
      objects?: string[];
      text?: string;
      scene?: string;
      confidence: number;
    };
    processingTime: number;
  }>;
  
  // === BATCH PROCESSING ===
  
  /**
   * Process multiple images in batch
   */
  processBatch(params: {
    images: ImageData[];
    operations: Array<{
      type: 'resize' | 'convert' | 'optimize' | 'analyze';
      params: Record<string, unknown>;
    }>;
    parallel?: boolean;
  }): Promise<{
    results: Array<{
      imageId: string;
      success: boolean;
      result?: unknown;
      error?: string;
      processingTime: number;
    }>;
    totalTime: number;
    successRate: number;
  }>;
  
  // === METADATA MANAGEMENT ===
  
  /**
   * Extract image metadata
   */
  extractMetadata(imageData: string): Promise<{
    dimensions: { width: number; height: number };
    format: string;
    fileSize: number;
    colorSpace: string;
    hasTransparency: boolean;
    exif?: Record<string, unknown>;
  }>;
  
  /**
   * Generate image thumbnail
   */
  generateThumbnail(params: {
    imageData: string;
    size: number;
    quality?: number;
  }): Promise<{
    thumbnail: string; // base64
    originalSize: number;
    thumbnailSize: number;
  }>;
  
  // === CONFIGURATION ===
  
  updateConfig(config: Partial<ImageProcessorConfig>): Promise<void>;
  getConfig(): ImageProcessorConfig;
}

// === ADAPTER INTERFACES ===

export interface ImageUploadAdapter {
  processMultipleFiles(files: unknown[]): Promise<Array<{
    data: Buffer;
    filename: string;
    mimetype: string;
    size: number;
  }>>;
  
  validateFileUpload(file: unknown): { isValid: boolean; errors: string[] };
  convertToBase64(buffer: Buffer): string;
}

export interface FormatConverterAdapter {
  convertImage(data: Buffer, fromFormat: string, toFormat: string, options?: Record<string, unknown>): Promise<Buffer>;
  resizeImage(data: Buffer, width: number, height: number, options?: Record<string, unknown>): Promise<Buffer>;
  compressImage(data: Buffer, quality: number): Promise<Buffer>;
  extractMetadata(data: Buffer): Promise<Record<string, unknown>>;
}

// === EVENT PUBLISHERS ===

export interface ImageEventPublisher {
  publishImageUploaded(event: ImageUploaded): void;
  publishImageProcessed(event: ImageProcessed): void;
}

// === EXTERNAL DEPENDENCIES ===

export interface ImageProcessorDependencies {
  imageUploadAdapter: ImageUploadAdapter;
  formatConverterAdapter: FormatConverterAdapter;
  eventPublisher: ImageEventPublisher;
  config: ImageProcessorConfig;
}
