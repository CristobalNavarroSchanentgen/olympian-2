"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelMetadataAdapter = createModelMetadataAdapter;
function createModelMetadataAdapter() {
    return {
        extractMetadata(modelInfo) {
            const name = modelInfo.name?.toLowerCase() || '';
            const details = modelInfo.details || {};
            return {
                family: detectFamily(name, details),
                size: detectSize(name, details),
                architecture: detectArchitecture(name, details),
                trainingData: detectTrainingData(name),
                languages: detectLanguages(name, details),
                specializations: detectSpecializations(name),
                limitations: detectLimitations(name, details),
                recommendedUse: detectRecommendedUse(name, details)
            };
        },
        enrichCapabilities(capability, metadata) {
            const enriched = {
                ...capability,
                metadata: {
                    ...capability.metadata,
                    ...metadata,
                    category: categorizeModel(metadata),
                    summary: generateModelSummary(capability)
                }
            };
            // Adjust capabilities based on metadata
            if (metadata.specializations.includes('vision')) {
                enriched.supportsVision = true;
                if (!enriched.capabilities.includes('vision')) {
                    enriched.capabilities.push('vision');
                }
            }
            if (metadata.specializations.includes('code')) {
                if (!enriched.capabilities.includes('code')) {
                    enriched.capabilities.push('code');
                }
            }
            // Adjust context window based on known model limits
            if (metadata.family === 'llama3' && metadata.size === '8b') {
                enriched.contextWindow = Math.min(enriched.contextWindow, 8192);
            }
            if (metadata.family === 'codellama') {
                enriched.contextWindow = Math.min(enriched.contextWindow, 16384);
            }
            return enriched;
        },
        categorizeModel(metadata) {
            let primary = 'chat';
            const secondary = [];
            // Determine primary category
            if (metadata.specializations.includes('vision')) {
                primary = 'vision';
            }
            else if (metadata.specializations.includes('code')) {
                primary = 'code';
            }
            else if (metadata.specializations.includes('embedding')) {
                primary = 'embedding';
            }
            else if (metadata.specializations.length > 0) {
                primary = 'specialized';
            }
            // Add secondary categories
            metadata.specializations.forEach(spec => {
                if (spec !== primary) {
                    secondary.push(spec);
                }
            });
            // Determine complexity
            let complexity = 'medium';
            if (metadata.size.includes('7b') || metadata.size.includes('small')) {
                complexity = 'simple';
            }
            else if (metadata.size.includes('70b') || metadata.size.includes('large')) {
                complexity = 'complex';
            }
            // Determine performance characteristics
            let performance = 'balanced';
            if (complexity === 'simple') {
                performance = 'fast';
            }
            else if (complexity === 'complex') {
                performance = 'accurate';
            }
            return {
                primary,
                secondary,
                complexity,
                performance
            };
        },
        generateModelSummary(capability) {
            const metadata = capability.metadata;
            const category = categorizeModel(metadata);
            const title = generateTitle(capability.modelName, metadata, category);
            const description = generateDescription(metadata, category);
            return {
                title,
                description,
                strengths: generateStrengths(metadata, category),
                limitations: metadata.limitations,
                bestFor: metadata.recommendedUse,
                notRecommendedFor: generateNotRecommended(metadata, category)
            };
        },
        // Helper methods
        detectFamily(name, details) {
            if (name.includes('llama3'))
                return 'llama3';
            if (name.includes('llama2'))
                return 'llama2';
            if (name.includes('llama'))
                return 'llama';
            if (name.includes('mistral'))
                return 'mistral';
            if (name.includes('codellama'))
                return 'codellama';
            if (name.includes('phi'))
                return 'phi';
            if (name.includes('gemma'))
                return 'gemma';
            if (name.includes('llava'))
                return 'llava';
            if (name.includes('vicuna'))
                return 'vicuna';
            if (name.includes('alpaca'))
                return 'alpaca';
            return details.family || 'unknown';
        },
        detectSize(name, details) {
            const sizePatterns = ['7b', '13b', '30b', '70b', '8b', '22b', '3b'];
            for (const pattern of sizePatterns) {
                if (name.includes(pattern))
                    return pattern;
            }
            if (details.parameter_size)
                return details.parameter_size;
            if (name.includes('small'))
                return 'small';
            if (name.includes('large'))
                return 'large';
            return 'unknown';
        },
        detectArchitecture(name, details) {
            if (name.includes('transformer'))
                return 'transformer';
            if (name.includes('mamba'))
                return 'mamba';
            if (details.architecture)
                return details.architecture;
            return 'transformer'; // Most models are transformers
        },
        detectTrainingData(name) {
            if (name.includes('instruct'))
                return 'instruction-tuned';
            if (name.includes('chat'))
                return 'conversation-tuned';
            if (name.includes('code'))
                return 'code-focused';
            if (name.includes('uncensored'))
                return 'uncensored';
            return 'general';
        },
        detectLanguages(name, details) {
            const languages = ['english']; // Default
            if (name.includes('multilingual') || name.includes('multi')) {
                languages.push('multilingual');
            }
            if (name.includes('chinese'))
                languages.push('chinese');
            if (name.includes('japanese'))
                languages.push('japanese');
            if (name.includes('korean'))
                languages.push('korean');
            if (name.includes('spanish'))
                languages.push('spanish');
            if (name.includes('french'))
                languages.push('french');
            if (name.includes('german'))
                languages.push('german');
            return languages;
        },
        detectSpecializations(name) {
            const specializations = [];
            if (name.includes('vision') || name.includes('llava')) {
                specializations.push('vision');
            }
            if (name.includes('code') || name.includes('coder')) {
                specializations.push('code');
            }
            if (name.includes('embed')) {
                specializations.push('embedding');
            }
            if (name.includes('math')) {
                specializations.push('mathematics');
            }
            if (name.includes('medical') || name.includes('bio')) {
                specializations.push('medical');
            }
            if (name.includes('legal')) {
                specializations.push('legal');
            }
            return specializations;
        },
        detectLimitations(name, details) {
            const limitations = [];
            if (name.includes('7b') || name.includes('3b')) {
                limitations.push('Limited reasoning capabilities');
                limitations.push('May struggle with complex tasks');
            }
            if (!name.includes('instruct') && !name.includes('chat')) {
                limitations.push('Not fine-tuned for conversation');
            }
            if (!name.includes('vision') && !name.includes('llava')) {
                limitations.push('No visual understanding');
            }
            if (name.includes('uncensored')) {
                limitations.push('May generate inappropriate content');
            }
            return limitations;
        },
        detectRecommendedUse(name, details) {
            const uses = [];
            if (name.includes('chat') || name.includes('instruct')) {
                uses.push('Conversational AI');
                uses.push('Question answering');
            }
            if (name.includes('code')) {
                uses.push('Code generation');
                uses.push('Programming assistance');
            }
            if (name.includes('vision')) {
                uses.push('Image analysis');
                uses.push('Visual question answering');
            }
            if (name.includes('7b') || name.includes('small')) {
                uses.push('Fast responses');
                uses.push('Resource-constrained environments');
            }
            if (name.includes('70b') || name.includes('large')) {
                uses.push('Complex reasoning');
                uses.push('High-quality outputs');
            }
            return uses.length > 0 ? uses : ['General text generation'];
        },
        generateTitle(modelName, metadata, category) {
            const familyName = metadata.family.charAt(0).toUpperCase() + metadata.family.slice(1);
            const sizeInfo = metadata.size !== 'unknown' ? ` (${metadata.size.toUpperCase()})` : '';
            const specialization = category.primary !== 'chat' ? ` - ${category.primary}` : '';
            return `${familyName}${sizeInfo}${specialization}`;
        },
        generateDescription(metadata, category) {
            const family = metadata.family;
            const size = metadata.size;
            const primary = category.primary;
            let description = `A ${category.performance} ${family} model`;
            if (size !== 'unknown') {
                description += ` with ${size} parameters`;
            }
            if (primary !== 'chat') {
                description += ` specialized for ${primary} tasks`;
            }
            description += `. ${category.complexity === 'simple' ? 'Good for fast responses' :
                category.complexity === 'complex' ? 'Excellent for complex reasoning' :
                    'Balanced performance and speed'}.`;
            return description;
        },
        generateStrengths(metadata, category) {
            const strengths = [];
            if (category.performance === 'fast') {
                strengths.push('Fast response times');
                strengths.push('Low resource usage');
            }
            if (category.performance === 'accurate') {
                strengths.push('High-quality outputs');
                strengths.push('Complex reasoning abilities');
            }
            if (metadata.specializations.includes('code')) {
                strengths.push('Strong programming capabilities');
            }
            if (metadata.specializations.includes('vision')) {
                strengths.push('Visual understanding');
            }
            if (metadata.languages.includes('multilingual')) {
                strengths.push('Multiple language support');
            }
            return strengths.length > 0 ? strengths : ['General text generation'];
        },
        generateNotRecommended(metadata, category) {
            const notRecommended = [];
            if (category.complexity === 'simple') {
                notRecommended.push('Complex reasoning tasks');
                notRecommended.push('Long-form content generation');
            }
            if (!metadata.specializations.includes('code')) {
                notRecommended.push('Advanced programming tasks');
            }
            if (!metadata.specializations.includes('vision')) {
                notRecommended.push('Image analysis tasks');
            }
            if (category.performance === 'accurate') {
                notRecommended.push('Real-time applications requiring speed');
            }
            return notRecommended;
        }
    };
}
//# sourceMappingURL=model-metadata-adapter.js.map