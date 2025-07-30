"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = exports.validationMiddleware = exports.debugMiddleware = void 0;
const debugMiddleware = (event) => {
    console.log("[EVENT]", event.type, event.payload);
};
exports.debugMiddleware = debugMiddleware;
const validationMiddleware = (event) => {
    if (!event.type)
        console.warn("Missing event type", event);
};
exports.validationMiddleware = validationMiddleware;
const metricsMiddleware = (event) => {
    // Metrics tracking placeholder
};
exports.metricsMiddleware = metricsMiddleware;
//# sourceMappingURL=event-middleware.js.map