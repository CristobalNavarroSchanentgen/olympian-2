import { processImage } from '../../../utils/image-processor';
// Helper functions extracted from adapter
async function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            reject(new Error('Failed to load image'));
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });
}
function generateImageId() {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
async function performValidation(file) {
    const errors = [];
    const warnings = [];
    // Size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        errors.push(`File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum of 10MB`);
    }
    // Format validation
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedFormats.includes(file.type)) {
        errors.push(`Unsupported format: ${file.type}. Supported: ${supportedFormats.join(', ')}`);
    }
    // Get image dimensions
    let dimensions;
    try {
        dimensions = await getImageDimensions(file);
        // Warn about very large images
        if (dimensions.width > 4096 || dimensions.height > 4096) {
            warnings.push('Large image may be resized for processing');
        }
        // Warn about very small images
        if (dimensions.width < 100 || dimensions.height < 100) {
            warnings.push('Small image may have reduced analysis quality');
        }
    }
    catch (error) {
        errors.push('Could not read image dimensions');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        metadata: {
            size: file.size,
            format: file.type,
            dimensions
        }
    };
}
async function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            // Remove data URL prefix if present
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
}
async function processImageFile(file) {
    // Validate first
    const validation = await performValidation(file);
    if (!validation.valid) {
        throw new Error(`Upload validation failed: ${validation.errors.join(', ')}`);
    }
    try {
        // Convert to base64
        const base64 = await convertFileToBase64(file);
        // Process with image utility
        const processed = await processImage(base64, {
            maxWidth: 2048,
            maxHeight: 2048,
            quality: 0.9,
            format: 'jpeg'
        });
        const imageData = {
            id: generateImageId(),
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            base64Data: processed.base64,
            dimensions: validation.metadata.dimensions || { width: 0, height: 0 },
            uploadedAt: new Date(),
            metadata: {
                originalSize: file.size,
                processedSize: processed.size,
                compressionRatio: file.size > 0 ? processed.size / file.size : 1,
                processingTime: processed.processingTime || 0,
                format: processed.format || file.type
            }
        };
        return imageData;
    }
    catch (error) {
        throw new Error(`Image processing failed: ${error.message}`);
    }
}
export function createImageUploadAdapter() {
    return {
        async validateUpload(file) {
            return await performValidation(file);
        },
        async processUpload(file) {
            return await processImageFile(file);
        },
        async batchProcessUploads(files) {
            const results = [];
            const errors = [];
            // Process files sequentially to avoid memory issues
            for (const file of files) {
                try {
                    const imageData = await processImageFile(file);
                    results.push(imageData);
                }
                catch (error) {
                    errors.push(`${file.name}: ${error.message}`);
                }
            }
            if (errors.length > 0) {
                console.warn('Some images failed to process:', errors);
            }
            return results;
        },
        async convertToBase64(file) {
            return await convertFileToBase64(file);
        }
    };
}
//# sourceMappingURL=image-upload-adapter.js.map