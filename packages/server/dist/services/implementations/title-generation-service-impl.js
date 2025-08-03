"use strict";
/**
 * Title Generation Service Implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleGenerationServiceImpl = void 0;
class TitleGenerationServiceImpl {
    titleGenerator;
    constructor(titleGenerator) {
        this.titleGenerator = titleGenerator;
    }
    async generateTitle(request) {
        return this.titleGenerator.generateTitle(request);
    }
    async autoGenerateTitle(conversationId, firstMessage) {
        const request = {
            conversationId,
            firstMessage,
            model: undefined // Will use default from config
        };
        const response = await this.titleGenerator.generateTitle(request);
        return response.generatedTitle;
    }
    async isAvailable() {
        return this.titleGenerator.isEnabled();
    }
    async getConfig() {
        return this.titleGenerator.getConfig();
    }
    async updateConfig(config) {
        return this.titleGenerator.updateConfig(config);
    }
}
exports.TitleGenerationServiceImpl = TitleGenerationServiceImpl;
//# sourceMappingURL=title-generation-service-impl.js.map