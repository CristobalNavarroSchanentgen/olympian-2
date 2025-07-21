"use strict";
/**
 * Models detected event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelsDetectedEvent = createModelsDetectedEvent;
function createModelsDetectedEvent(connectionId, models, detectionMethod, detectionTime, errors = []) {
    return {
        type: 'models-detected',
        connectionId,
        models,
        timestamp: new Date(),
        metadata: {
            detectionMethod,
            totalModels: models.length,
            detectionTime,
            errors
        }
    };
}
//# sourceMappingURL=models-detected.js.map