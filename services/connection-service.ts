export interface ConnectionService {
  establishConnection(connectionId: string, config: any): Promise<void>;
  closeConnection(connectionId: string): Promise<void>;
  isConnected(connectionId: string): boolean;
  getConnectionStatus(connectionId: string): any;
}

