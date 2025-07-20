/**
 * Vision image data model - pure types only
 */

export interface ImageData {
  readonly id: string;
  readonly filename: string;
  readonly mimeType: ImageMimeType;
  readonly base64Data: string;
  readonly size: number;
  readonly dimensions: ImageDimensions;
  readonly uploadedAt: Date;
}

export type ImageMimeType = 
  | 'image/png' 
  | 'image/jpeg' 
  | 'image/jpg'
  | 'image/gif' 
  | 'image/webp';

export interface ImageDimensions {
  readonly width: number;
  readonly height: number;
}

export interface ImageUpload {
  readonly file: File;
  readonly preview: string;
  readonly id: string;
}

export interface ImageValidation {
  readonly valid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly metadata: ImageMetadata;
}

export interface ImageMetadata {
  readonly format: string;
  readonly size: number;
  readonly dimensions: ImageDimensions;
  readonly colorSpace?: string;
  readonly hasAlpha?: boolean;
}
