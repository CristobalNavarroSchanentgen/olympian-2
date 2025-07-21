/**
 * Image uploaded event
 */

export interface ImageUploadedEvent {
  readonly type: 'image-uploaded';
  readonly imageId: string;
  readonly conversationId: string;
  readonly filename: string;
  readonly timestamp: Date;
  readonly metadata: {
    readonly size: number;
    readonly mimeType: string;
    readonly dimensions: {
      readonly width: number;
      readonly height: number;
    };
    readonly compressed: boolean;
    readonly validationPassed: boolean;
  };
}

export function createImageUploadedEvent(
  imageId: string,
  conversationId: string,
  filename: string,
  size: number,
  mimeType: string,
  dimensions: { width: number; height: number },
  compressed = false,
  validationPassed = true
): ImageUploadedEvent {
  return {
    type: 'image-uploaded',
    imageId,
    conversationId,
    filename,
    timestamp: new Date(),
    metadata: {
      size,
      mimeType,
      dimensions,
      compressed,
      validationPassed
    }
  };
}
