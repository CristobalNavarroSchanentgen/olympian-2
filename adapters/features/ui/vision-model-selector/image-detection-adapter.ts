/**
 * Image Detection Adapter
 * Detects images in message inputs for vision model routing
 */

export interface MessageInput {
  content: string;
  attachments?: {
    type: string;
    data: string;
  }[];
}

export interface ImageDetectionAdapter {
  detectImages(input: MessageInput): boolean;
  requiresVision(input: MessageInput): boolean;
  getContentType(input: MessageInput): 'text' | 'vision' | 'mixed';
  getImageCount(input: MessageInput): number;
}

const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp'
];

export function createImageDetectionAdapter(): ImageDetectionAdapter {
  return {
    detectImages(input: MessageInput): boolean {
      if (!input.attachments || input.attachments.length === 0) {
        return false;
      }

      return input.attachments.some(attachment => 
        IMAGE_MIME_TYPES.some(imageType => 
          attachment.type.toLowerCase().startsWith(imageType.toLowerCase())
        )
      );
    },

    requiresVision(input: MessageInput): boolean {
      return this.detectImages(input);
    },

    getContentType(input: MessageInput): 'text' | 'vision' | 'mixed' {
      const hasImages = this.detectImages(input);
      const hasText = input.content?.trim().length > 0;

      if (hasImages && hasText) return 'mixed';
      if (hasImages) return 'vision';
      return 'text';
    },

    getImageCount(input: MessageInput): number {
      if (!input.attachments) return 0;
      
      return input.attachments.filter(attachment =>
        IMAGE_MIME_TYPES.some(imageType =>
          attachment.type.toLowerCase().startsWith(imageType.toLowerCase())
        )
      ).length;
    }
  };
}

// Helper function to analyze input and provide routing recommendations
export function analyzeInputForRouting(input: MessageInput) {
  const adapter = createImageDetectionAdapter();
  
  return {
    hasImages: adapter.detectImages(input),
    imageCount: adapter.getImageCount(input),
    contentType: adapter.getContentType(input),
    requiresVisionModel: adapter.requiresVision(input),
    recommendations: {
      preferVisionModel: adapter.requiresVision(input),
      canUseTextModel: input.content?.trim().length > 0,
      isMultimodalContent: adapter.getContentType(input) === 'mixed'
    }
  };
}
