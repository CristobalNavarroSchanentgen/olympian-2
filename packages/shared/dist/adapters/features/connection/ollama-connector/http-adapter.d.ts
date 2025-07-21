import { OllamaConnection } from '../../../models/connection';
export interface HttpAdapter {
    testConnection(connection: OllamaConnection): Promise<any>;
    establishConnection(endpoint: string): Promise<OllamaConnection>;
    listModels(connection: OllamaConnection): Promise<any[]>;
    checkHealth(connection: OllamaConnection): Promise<any>;
}
export declare function createHttpAdapter(): HttpAdapter;
//# sourceMappingURL=http-adapter.d.ts.map