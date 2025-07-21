/**
 * Ollama Connection Models
 */
export type ServiceStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export interface OllamaConnection {
    id: string;
    baseUrl: string;
    status: ServiceStatus;
    version?: string;
    models: string[];
    lastPing?: Date;
    metadata: Record<string, unknown>;
}
//# sourceMappingURL=ollama-connection.d.ts.map