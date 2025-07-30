export function validateImageFormat(mimeType) {
    const supportedFormats = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
    ];
    return supportedFormats.includes(mimeType.toLowerCase());
}
export function convertToBase64(buffer, mimeType) {
    return buffer.toString('base64');
}
//# sourceMappingURL=image-processor.js.map