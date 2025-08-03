export interface ImageService {
  uploadImage(imageData: any): Promise<string>;
  processImage(imageId: string, options: any): Promise<any>;
  getProcessedImage(imageId: string): Promise<any>;
  deleteImage(imageId: string): Promise<void>;
}

