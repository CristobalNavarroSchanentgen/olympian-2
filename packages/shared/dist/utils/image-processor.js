"use strict";
/**
 * Image Processor Utility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageFormat = validateImageFormat;
exports.calculateDimensions = calculateDimensions;
exports.estimateImageTokens = estimateImageTokens;
function validateImageFormat(mimetype) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(mimetype);
}
function calculateDimensions(original, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / original.width, maxHeight / original.height, 1);
    return {
        width: Math.floor(original.width * ratio),
        height: Math.floor(original.height * ratio)
    };
}
function estimateImageTokens(width, height) {
    return Math.ceil((width * height) / 1000);
}
//# sourceMappingURL=image-processor.js.map