"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageFormat = validateImageFormat;
exports.convertToBase64 = convertToBase64;
function validateImageFormat(mimeType) {
    const supportedFormats = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
    ];
    return supportedFormats.includes(mimeType.toLowerCase());
}
function convertToBase64(buffer, mimeType) {
    return buffer.toString('base64');
}
//# sourceMappingURL=image-processor.js.map