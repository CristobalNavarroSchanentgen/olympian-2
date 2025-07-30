/**
 * Shared Package Entry Point - Minimal Working Version
 */

// Basic Models (these should work)
export type { Artifact, ArtifactType } from './models/artifacts/artifact';
export type { Version } from './models/artifacts/version';
export type { Conversation } from './models/chat/conversation';
export type { Message, MessageRole } from './models/chat/message';
export type { McpServerConfig } from './models/mcp/server-config';
export type { OllamaConnection } from './models/connection/ollama-connection';

// Basic utilities that should work
export * from './utils/token-counter';
export * from './utils/http-client';
export * from './utils/config-parser';
export * from './utils/image-processor';

// Only export contracts that exist and work
export type { ConversationManagerContract } from './features/chat/conversation-manager/contract';
export type { MessageProcessorContract } from './features/chat/message-processor/contract';
