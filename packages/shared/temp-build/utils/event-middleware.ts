export const debugMiddleware = (event: any): void => {
  console.log("[EVENT]", event.type, event.payload);
};

export const validationMiddleware = (event: any): void => {
  if (!event.type) console.warn("Missing event type", event);
};

export const metricsMiddleware = (event: any): void => {
  // Metrics tracking placeholder
};