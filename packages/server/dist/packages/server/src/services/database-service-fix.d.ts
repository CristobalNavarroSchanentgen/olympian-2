export declare class DatabaseService {
    private db;
    connect(): Promise<void>;
    createMessage(data: any): Promise<any>;
    updateMessage(id: string, data: any): Promise<any>;
    createConversation(data: any): Promise<any>;
    updateConversation(id: string, data: any): Promise<any>;
}
