"use strict";
/**
 * Artifact created event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtifactCreatedEvent = createArtifactCreatedEvent;
function createArtifactCreatedEvent(artifactId, conversationId, messageId, artifactType, title, size, version = 1, language, tags = [], autoGenerated = true) {
    return {
        type: 'artifact-created',
        artifactId,
        conversationId,
        messageId,
        artifactType,
        title,
        timestamp: new Date(),
        metadata: {
            size,
            language,
            version,
            tags,
            autoGenerated
        }
    };
}
//# sourceMappingURL=artifact-created.js.map