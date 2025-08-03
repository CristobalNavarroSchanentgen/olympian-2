/**
 * Events Index
 * Central export for all event types
 */

// Chat domain events
export * from "./conversation-created";
export * from "./conversation-updated";
export * from "./conversation-deleted";
export * from "./conversation-title-generated";
export * from "./message-sent";
export * from "./message-received";
export * from "./tokens-processed";
export * from "./context-updated";
export * from "./memory-cleaned";
export * from "./model-routed";
export * from "./routing-failed";

// MCP domain events
export * from "./server-started";
export * from "./server-stopped";
export * from "./server-error";
export * from "./tool-invoked";
export * from "./tool-completed";
export * from "./tool-failed";

// Artifacts domain events
export * from "./artifact-created";
export * from "./artifact-updated";
export * from "./artifact-deleted";

// UI domain events
export * from "./layout-changed";
export * from "./text-model-selected";
export * from "./vision-model-selected";
export * from "./model-selection-failed";

// System events (not in manifest - legacy)
export * from "./browser-log-captured";
export * from "./log-aggregation-requested";
