/**
 * Image Processor Utility
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: string;
}

export function validateImageFormat(mimetype: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(mimetype);
}

export function calculateDimensions(
  original: ImageDimensions,
  maxWidth: number,
  maxHeight: number
): ImageDimensions {
  const ratio = Math.min(
    maxWidth / original.width,
    maxHeight / original.height,
    1
  );
  
  return {
    width: Math.floor(original.width * ratio),
    height: Math.floor(original.height * ratio)
  };
}

export function estimateImageTokens(width: number, height: number): number {
  return Math.ceil((width * height) / 1000);
}
