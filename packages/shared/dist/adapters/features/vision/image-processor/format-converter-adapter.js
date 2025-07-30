"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormatConverterAdapter = createFormatConverterAdapter;
const image_processor_1 = require("../../../utils/image-processor");
// Helper functions extracted from adapter
function getOptimalQuality(format) {
    switch (format) {
        case 'jpeg': return 0.9;
        case 'webp': return 0.85;
        case 'png': return 1.0; // PNG is lossless
        case 'gif': return 1.0; // GIF is lossless
        default: return 0.9;
    }
}
function getThumbnailDimensions(size) {
    switch (size) {
        case 'small': return { width: 150, height: 150 };
        case 'medium': return { width: 300, height: 300 };
        case 'large': return { width: 600, height: 600 };
        case 'custom': return { width: 400, height: 400 }; // Default for custom
        default: return { width: 300, height: 300 };
    }
}
function meetsRequirements(imageData, requirements) {
    const { dimensions, size, mimeType } = imageData;
    // Check format
    if (mimeType !== `image/${requirements.format}`) {
        return false;
    }
    // Check dimensions
    if (dimensions.width > requirements.maxWidth || dimensions.height > requirements.maxHeight) {
        return false;
    }
    // Check size if specified
    if (requirements.maxSizeBytes && size > requirements.maxSizeBytes) {
        return false;
    }
    return true;
}
function generateConvertedId(originalId) {
    return `${originalId}_converted_${Date.now()}`;
}
function generateOptimizedId(originalId) {
    return `${originalId}_optimized_${Date.now()}`;
}
function generateThumbnailId(originalId, size) {
    return `${originalId}_thumb_${size}_${Date.now()}`;
}
function generateModelReadyId(originalId) {
    return `${originalId}_model_ready_${Date.now()}`;
}
function createFormatConverterAdapter() {
    return {
        async convertFormat(imageData, targetFormat) {
            try {
                const processed = await (0, image_processor_1.processImage)(imageData.base64Data, {
                    format: targetFormat,
                    quality: getOptimalQuality(targetFormat),
                    preserveMetadata: true
                });
                return {
                    ...imageData,
                    id: generateConvertedId(imageData.id),
                    mimeType: `image/${targetFormat}`,
                    base64Data: processed.base64,
                    size: processed.size,
                    metadata: {
                        ...imageData.metadata,
                        originalFormat: imageData.mimeType,
                        convertedAt: new Date(),
                        conversionTime: processed.processingTime || 0,
                        format: targetFormat
                    }
                };
            }
            catch (error) {
                throw new Error(`Format conversion failed: ${error.message}`);
            }
        },
        async optimizeForVision(imageData) {
            // Vision models typically work best with JPEG format at reasonable quality
            const optimized = await (0, image_processor_1.processImage)(imageData.base64Data, {
                maxWidth: 1024,
                maxHeight: 1024,
                format: 'jpeg',
                quality: 0.85,
                removeMetadata: true // Remove EXIF data for privacy/size
            });
            return {
                ...imageData,
                id: generateOptimizedId(imageData.id),
                mimeType: 'image/jpeg',
                base64Data: optimized.base64,
                size: optimized.size,
                dimensions: {
                    width: optimized.width || imageData.dimensions.width,
                    height: optimized.height || imageData.dimensions.height
                },
                metadata: {
                    ...imageData.metadata,
                    optimizedForVision: true,
                    optimizedAt: new Date(),
                    originalDimensions: imageData.dimensions,
                    compressionRatio: imageData.size > 0 ? optimized.size / imageData.size : 1
                }
            };
        },
        async createThumbnail(imageData, size) {
            const dimensions = getThumbnailDimensions(size);
            const thumbnail = await (0, image_processor_1.processImage)(imageData.base64Data, {
                maxWidth: dimensions.width,
                maxHeight: dimensions.height,
                format: 'jpeg',
                quality: 0.8,
                maintainAspectRatio: true
            });
            return {
                ...imageData,
                id: generateThumbnailId(imageData.id, size),
                base64Data: thumbnail.base64,
                size: thumbnail.size,
                dimensions: {
                    width: thumbnail.width || dimensions.width,
                    height: thumbnail.height || dimensions.height
                },
                metadata: {
                    ...imageData.metadata,
                    isThumbnail: true,
                    thumbnailSize: size,
                    createdAt: new Date(),
                    parentImageId: imageData.id
                }
            };
        },
        async prepareForModel(imageData, requirements) {
            try {
                // Check if image already meets requirements
                if (meetsRequirements(imageData, requirements)) {
                    return imageData;
                }
                // Process image to meet requirements
                const processed = await (0, image_processor_1.processImage)(imageData.base64Data, {
                    maxWidth: requirements.maxWidth,
                    maxHeight: requirements.maxHeight,
                    format: requirements.format,
                    quality: requirements.quality,
                    maintainAspectRatio: true
                });
                // Check size constraint if specified
                if (requirements.maxSizeBytes && processed.size > requirements.maxSizeBytes) {
                    // Reduce quality iteratively until size constraint is met
                    let quality = requirements.quality;
                    let result = processed;
                    while (result.size > requirements.maxSizeBytes && quality > 0.1) {
                        quality -= 0.1;
                        result = await (0, image_processor_1.processImage)(imageData.base64Data, {
                            maxWidth: requirements.maxWidth,
                            maxHeight: requirements.maxHeight,
                            format: requirements.format,
                            quality: quality,
                            maintainAspectRatio: true
                        });
                    }
                    processed.base64 = result.base64;
                    processed.size = result.size;
                }
                return {
                    ...imageData,
                    id: generateModelReadyId(imageData.id),
                    mimeType: `image/${requirements.format}`,
                    base64Data: processed.base64,
                    size: processed.size,
                    dimensions: {
                        width: processed.width || imageData.dimensions.width,
                        height: processed.height || imageData.dimensions.height
                    },
                    metadata: {
                        ...imageData.metadata,
                        preparedForModel: true,
                        modelRequirements: requirements,
                        preparedAt: new Date(),
                        finalQuality: processed.quality || requirements.quality
                    }
                };
            }
            catch (error) {
                throw new Error(`Model preparation failed: ${error.message}`);
            }
        }
    };
}
//# sourceMappingURL=format-converter-adapter.js.map