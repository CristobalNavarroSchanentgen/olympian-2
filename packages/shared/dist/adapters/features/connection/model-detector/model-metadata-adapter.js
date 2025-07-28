"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelMetadataAdapter = createModelMetadataAdapter;
// Standalone helper functions for proper scoping
function detectFamily(name, details) {
    if (name.includes('llama3'))
        return 'llama3';
    if (name.includes('codellama'))
        return 'codellama';
    if (name.includes('llama'))
        return 'llama';
    if (name.includes('mistral'))
        return 'mistral';
    if (name.includes('phi'))
        return 'phi';
    if (name.includes('gemma'))
        return 'gemma';
    if (name.includes('llava'))
        return 'llava';
    return details.family || 'unknown';
}
function detectSize(name, details) {
    const sizes = ['7b', '13b', '30b', '70b', '8b', '3b'];
    for (const size of sizes) {
        if (name.includes(size))
            return size;
    }
    return details.parameter_size || 'unknown';
}
function detectArchitecture(name, details) {
    if (name.includes('transformer'))
        return 'transformer';
    if (name.includes('mamba'))
        return 'mamba';
    return details.architecture || 'transformer';
}
function createModelMetadataAdapter() {
    return {
        extractMetadata(modelInfo) {
            const name = modelInfo.name?.toLowerCase() || '';
            const details = modelInfo.details || {};
            return {
                family: detectFamily(name, details),
                size: detectSize(name, details),
                architecture: detectArchitecture(name, details),
                trainingData: name.includes('instruct') ? 'instruction-tuned' : 'general',
                languages: ['english'],
                specializations: name.includes('vision') ? ['vision'] : [],
                limitations: [],
                recommendedUse: ['General text generation']
            };
        },
        enrichCapabilities(capability, metadata) {
            const enriched = {
                ...capability,
                metadata: {
                    ...capability.metadata,
                    ...metadata
                }
            };
            if (metadata.specializations.includes('vision')) {
                enriched.supportsVision = true;
            }
            return enriched;
        },
        categorizeModel(metadata) {
            return {
                primary: 'chat',
                secondary: [],
                complexity: 'medium',
                performance: 'balanced'
            };
        },
        generateModelSummary(capability) {
            return {
                title: capability.modelName,
                description: 'AI language model',
                strengths: ['Text generation'],
                limitations: [],
                bestFor: ['General use'],
                notRecommendedFor: []
            };
        }
    };
}
//# sourceMappingURL=model-metadata-adapter.js.map