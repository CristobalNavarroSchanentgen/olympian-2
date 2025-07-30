/**
 * Model Registry Helper Utilities
 */
import { PREDEFINED_MODEL_REGISTRY } from '../models/connection/model-registry';
/**
 * Get formatted model information for UI display
 */
export function getFormattedModelList() {
    return PREDEFINED_MODEL_REGISTRY.map(model => {
        const capabilities = [];
        if (model.hasVision)
            capabilities.push('Vision');
        if (model.hasTools)
            capabilities.push('Tools');
        if (model.hasReasoning)
            capabilities.push('Reasoning');
        return {
            name: model.modelName,
            displayName: formatModelName(model.modelName),
            capabilities,
            description: generateModelDescription(model)
        };
    });
}
/**
 * Format model name for display
 */
function formatModelName(modelName) {
    // Extract model family and size
    const parts = modelName.split(':');
    const [family, size] = parts;
    return `${family.charAt(0).toUpperCase() + family.slice(1)} ${size || ''}`.trim();
}
/**
 * Generate description based on capabilities
 */
function generateModelDescription(model) {
    const capabilities = [];
    if (model.hasVision) {
        capabilities.push('Process and analyze images');
    }
    if (model.hasTools) {
        capabilities.push('Use external tools and functions');
    }
    if (model.hasReasoning) {
        capabilities.push('Advanced reasoning and problem-solving');
    }
    if (capabilities.length === 0) {
        return 'General text generation and conversation';
    }
    return capabilities.join(', ');
}
/**
 * Check if registry mode is enabled
 */
export function isRegistryModeEnabled() {
    return process.env.AUTO_SCAN_MODELS === 'false';
}
/**
 * Get models grouped by capability
 */
export function getModelsByCapabilityGroup() {
    const groups = {
        'Vision Models': [],
        'Tool-Enabled Models': [],
        'Reasoning Models': [],
        'General Models': []
    };
    const modelInfos = getFormattedModelList();
    modelInfos.forEach(model => {
        if (model.capabilities.includes('Vision')) {
            groups['Vision Models'].push(model);
        }
        else if (model.capabilities.includes('Reasoning')) {
            groups['Reasoning Models'].push(model);
        }
        else if (model.capabilities.includes('Tools')) {
            groups['Tool-Enabled Models'].push(model);
        }
        else {
            groups['General Models'].push(model);
        }
    });
    // Remove empty groups
    Object.keys(groups).forEach(key => {
        if (groups[key].length === 0) {
            delete groups[key];
        }
    });
    return groups;
}
//# sourceMappingURL=model-registry-helper.js.map