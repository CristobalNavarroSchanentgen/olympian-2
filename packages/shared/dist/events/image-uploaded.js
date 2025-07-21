"use strict";
/**
 * Image uploaded event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImageUploadedEvent = createImageUploadedEvent;
function createImageUploadedEvent(imageId, conversationId, filename, size, mimeType, dimensions, compressed = false, validationPassed = true) {
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
//# sourceMappingURL=image-uploaded.js.map