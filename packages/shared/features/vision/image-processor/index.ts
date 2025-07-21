/**
 * Feature Implementation: Vision Image Processor
 */

import { ImageProcessorContract, ImageProcessorDependencies } from "./contract";
import { ImageData } from "../../../models/vision/image-data";
import { ProcessingResult } from "../../../models/vision/processing-result";

export class ImageProcessor implements ImageProcessorContract {
  private uploadQueue = new Map<string, Promise<ImageData>>();
  
  constructor(private deps: ImageProcessorDependencies) {}

  async uploadImage(params: {
    file: Buffer | string;
    filename: string;
    conversationId: string;
    metadata?: Record<string, unknown>;
  }): Promise<ImageData> {
    const uploadId = this.generateUploadId();
    
    if (this.uploadQueue.has(uploadId)) {
      return await this.uploadQueue.get(uploadId)!;
    }

    const uploadPromise = this.processUpload(params, uploadId);
    this.uploadQueue.set(uploadId, uploadPromise);

    try {
      const result = await uploadPromise;
      return result;
    } finally {
      this.uploadQueue.delete(uploadId);
    }
  }

  private async processUpload(params: any, uploadId: string): Promise<ImageData> {
    // Validate format
    const validation = this.deps.imageUploadAdapter.validateFormat(
      params.file,
      params.filename
    );

    if (!validation.valid) {
      throw new Error(`Invalid image format: ${validation.error}`);
    }

    // Convert and optimize
    const processedImage = await this.deps.formatConverter.convert({
      input: params.file,
      filename: params.filename,
      targetFormat: this.deps.config.processing.defaultFormat,
      quality: this.deps.config.processing.quality,
      maxWidth: this.deps.config.upload.maxWidth,
      maxHeight: this.deps.config.upload.maxHeight
    });

    const imageData: ImageData = {
      id: uploadId,
      conversationId: params.conversationId,
      filename: params.filename,
      mimeType: processedImage.mimeType,
      data: processedImage.data,
      size: processedImage.size,
      dimensions: processedImage.dimensions,
      uploadedAt: new Date(),
      metadata: params.metadata || {}
    };

    this.deps.eventPublisher.publishImageUploaded({
      imageId: imageData.id,
      conversationId: imageData.conversationId,
      filename: imageData.filename,
      size: imageData.size,
      timestamp: new Date()
    });

    return imageData;
  }

  async processImage(imageId: string, options?: any): Promise<ProcessingResult> {
    const imageData = await this.getImage(imageId);
    if (!imageData) {
      throw new Error(`Image not found: ${imageId}`);
    }

    const result = await this.deps.visionService.processImage({
      imageData: imageData.data,
      model: options?.model || this.deps.config.vision.defaultModel,
      prompt: options?.prompt,
      maxTokens: options?.maxTokens || this.deps.config.vision.maxTokens
    });

    const processedResult: ProcessingResult = {
      imageId,
      result: result.description,
      confidence: result.confidence,
      processingTime: result.processingTime,
      model: result.model,
      processedAt: new Date()
    };

    return processedResult;
  }

  async batchUpload(files: Array<{
    file: Buffer | string;
    filename: string;
    conversationId: string;
  }>): Promise<ImageData[]> {
    const uploads = files.map(file => this.uploadImage(file));
    const results = await Promise.allSettled(uploads);

    return results
      .filter(result => result.status === "fulfilled")
      .map(result => (result as PromiseFulfilledResult<ImageData>).value);
  }

  async batchProcess(imageIds: string[], options?: any): Promise<ProcessingResult[]> {
    const processes = imageIds.map(id => this.processImage(id, options));
    const results = await Promise.allSettled(processes);

    return results
      .filter(result => result.status === "fulfilled")
      .map(result => (result as PromiseFulfilledResult<ProcessingResult>).value);
  }

  async getImage(imageId: string): Promise<ImageData | null> {
    return await this.deps.visionService.getImage(imageId);
  }

  async deleteImage(imageId: string): Promise<void> {
    await this.deps.visionService.deleteImage(imageId);
  }

  async getImagesByConversation(conversationId: string): Promise<ImageData[]> {
    return await this.deps.visionService.getImagesByConversation(conversationId);
  }

  async analyzeWithVision(params: {
    imageIds: string[];
    prompt: string;
    model?: string;
  }): Promise<string> {
    const images = await Promise.all(
      params.imageIds.map(id => this.getImage(id))
    );

    const validImages = images.filter(img => img !== null) as ImageData[];
    
    if (validImages.length === 0) {
      throw new Error("No valid images found");
    }

    const result = await this.deps.visionService.analyzeMultiple({
      images: validImages,
      prompt: params.prompt,
      model: params.model || this.deps.config.vision.defaultModel
    });

    return result.analysis;
  }

  private generateUploadId(): string {
    return `img-${Date.now()}-${Math.random().toString(36).substr(2)}`;
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
