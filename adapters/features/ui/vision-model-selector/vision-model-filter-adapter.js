/**
 * Vision Model Filter Adapter
 * Filters models for vision capability
 */
export function createVisionModelFilterAdapter() {
    return {
        filterVisionModels(models) {
            return models.filter(model => model.hasVision === true);
        }
    };
}
// Helper function to get vision models with additional metadata
export function getVisionModelsWithMetadata(models) {
    const visionModels = createVisionModelFilterAdapter().filterVisionModels(models);
    return visionModels.map(model => ({
        ...model,
        canProcessImages: true,
        canProcessText: model.capabilities.includes('text-generation'),
        isMultimodal: model.capabilities.includes('text-generation'),
        recommendedFor: [
            'Image analysis',
            'Visual Q&A',
            ...(model.capabilities.includes('text-generation') ? ['Mixed text/image conversations'] : [])
        ],
        modelSize: model.modelName.includes(':11b') ? 'Large' :
            model.modelName.includes(':2b') ? 'Compact' : 'Medium'
    }));
}
//# sourceMappingURL=vision-model-filter-adapter.js.map