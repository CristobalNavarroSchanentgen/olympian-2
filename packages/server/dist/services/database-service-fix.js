export class DatabaseService {
    db;
    async connect() {
        console.log('Database connected (mock)');
    }
    async createMessage(data) {
        return { id: "msg_" + Date.now(), ...data };
    }
    async updateMessage(id, data) {
        return { id, ...data };
    }
    async createConversation(data) {
        return { id: "conv_" + Date.now(), ...data };
    }
    async updateConversation(id, data) {
        return { id, ...data };
    }
}
//# sourceMappingURL=database-service-fix.js.map