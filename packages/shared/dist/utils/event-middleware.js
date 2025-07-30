export const debugMiddleware = (event) => {
    console.log("[EVENT]", event.type, event.payload);
};
export const validationMiddleware = (event) => {
    if (!event.type)
        console.warn("Missing event type", event);
};
export const metricsMiddleware = (event) => {
    // Metrics tracking placeholder
};
//# sourceMappingURL=event-middleware.js.map