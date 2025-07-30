export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImageData {
  data: Buffer;
  base64Data: string;
  mimeType: string;
  dimensions: ImageDimensions;
}

export function validateImageFormat(mimeType: string): boolean {
  const supportedFormats = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ];
  return supportedFormats.includes(mimeType.toLowerCase());
}

export function convertToBase64(buffer: Buffer, mimeType: string): string {
  return buffer.toString('base64');
}
