/**
 * Artifact Validator Utility
 * Pure functions for validating artifacts
 */
export function validateArtifact(artifact) {
    const warnings = [];
    const suggestions = [];
    const errors = [];
    // Required fields
    if (!artifact.title) {
        errors.push('Title is required');
    }
    if (!artifact.content) {
        errors.push('Content is required');
    }
    if (!artifact.type) {
        errors.push('Type is required');
    }
    // Type validation
    if (artifact.type && !isValidArtifactType(artifact.type)) {
        errors.push('Invalid artifact type');
    }
    // Content validation
    if (artifact.content && artifact.content.length > 100000) {
        warnings.push('Content is very large, consider splitting');
    }
    // Title validation
    if (artifact.title && artifact.title.length > 100) {
        warnings.push('Title is quite long');
    }
    return {
        isValid: errors.length === 0,
        warnings,
        suggestions,
        errors
    };
}
function isValidArtifactType(type) {
    const validTypes = ['code', 'text', 'html', 'svg', 'react', 'mermaid'];
    return validTypes.includes(type);
}
//# sourceMappingURL=artifact-validator.js.map