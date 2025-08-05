/**
 * Image Detection Adapter
 * Detects images in message inputs for vision model routing
 */
const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp'
];
export function createImageDetectionAdapter() {
    return {
        detectImages(input) {
            if (!input.attachments || input.attachments.length === 0) {
                return false;
            }
            return input.attachments.some(attachment => IMAGE_MIME_TYPES.some(imageType => attachment.type.toLowerCase().startsWith(imageType.toLowerCase())));
        },
        requiresVision(input) {
            return this.detectImages(input);
        },
        getContentType(input) {
            const hasImages = this.detectImages(input);
            const hasText = input.content?.trim().length > 0;
            if (hasImages && hasText)
                return 'mixed';
            if (hasImages)
                return 'vision';
            return 'text';
        },
        getImageCount(input) {
            if (!input.attachments)
                return 0;
            return input.attachments.filter(attachment => IMAGE_MIME_TYPES.some(imageType => attachment.type.toLowerCase().startsWith(imageType.toLowerCase()))).length;
        }
    };
}
// Helper function to analyze input and provide routing recommendations
export function analyzeInputForRouting(input) {
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
//# sourceMappingURL=image-detection-adapter.js.map