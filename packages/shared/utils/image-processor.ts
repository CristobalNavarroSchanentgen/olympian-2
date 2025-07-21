/**
 * Image processing utility - pure functions
 */

import { ImageData, ImageMimeType, ImageValidation } from '../models/vision/image-data.js';

export interface ImageProcessingOptions {
  readonly maxSize: number;
  readonly allowedFormats: ImageMimeType[];
  readonly maxDimensions: { width: number; height: number };
  readonly compressionQuality: number;
}

/**
 * Default image processing options
 */
export function getDefaultImageOptions(): ImageProcessingOptions {
  return {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
    maxDimensions: { width: 4096, height: 4096 },
    compressionQuality: 0.8
  };
}

/**
 * Validate image file
 */
export function validateImage(
  file: File,
  options: ImageProcessingOptions = getDefaultImageOptions()
): ImageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check file size
  if (file.size > options.maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum (${formatFileSize(options.maxSize)})`);
  }
  
  // Check MIME type
  const mimeType = file.type as ImageMimeType;
  if (!options.allowedFormats.includes(mimeType)) {
    errors.push(`Unsupported format: ${mimeType}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: {
      format: mimeType,
      size: file.size,
      dimensions: { width: 0, height: 0 }
    }
  };
}

/**
 * Generate image ID from content
 */
export function generateImageId(file: File): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Create image data structure
 */
export function createImageData(
  id: string,
  file: File,
  base64Data: string,
  dimensions: { width: number; height: number }
): ImageData {
  return {
    id,
    filename: file.name,
    mimeType: file.type as ImageMimeType,
    base64Data,
    size: file.size,
    dimensions,
    uploadedAt: new Date()
  };
}
