/**
 * Feature Implementation: Ollama Connector
 */
import { OllamaConnectorContract, OllamaConnectorDependencies } from "./contract";
import { OllamaConnection } from "../../../models/connection/ollama-connection";
import { HealthStatus } from "../../../models/connection/health-status";
export declare class OllamaConnector implements OllamaConnectorContract {
    private deps;
    private currentConnection;
    private healthCheckInterval;
    constructor(deps: OllamaConnectorDependencies);
    connect(endpoint: string, options?: any): Promise<OllamaConnection>;
    disconnect(): Promise<void>;
    testConnection(endpoint?: string): Promise<any>;
    getHealth(): Promise<HealthStatus>;
    listModels(): Promise<any[]>;
    getModelInfo(modelName: string): Promise<any>;
    pullModel(modelName: string): Promise<AsyncIterableIterator<any>>;
    deleteModel(modelName: string): Promise<void>;
    generateCompletion(params: any): Promise<AsyncIterableIterator<string>>;
    chatCompletion(params: any): Promise<AsyncIterableIterator<string>>;
    embeddings(params: any): Promise<number[][]>;
    getConnection(): OllamaConnection | null;
    isConnected(): boolean;
    private ensureConnected;
    private startHealthMonitoring;
    private generateConnectionId;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map