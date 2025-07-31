"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaService {
    client;
    connected = false;
    baseUrl;
    connectionAttempts = [];
    lastSuccessfulConnection;
    reconnectInterval;
    modelRegistry;
    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        this.logConnectionDetails();
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 60000
        });
        // Add request interceptor for detailed logging
        this.client.interceptors.request.use((config) => {
            if (this.shouldLogVerbose()) {
                console.log('🦙 OLLAMA REQUEST INTERCEPTOR');
                console.log('📍 Full URL:', `${this.baseUrl}${config.url}`);
                console.log('🔧 Config:', JSON.stringify(config, null, 2));
            }
            return config;
        }, (error) => {
            if (this.shouldLogVerbose()) {
                console.log('❌ OLLAMA REQUEST ERROR:', error.message);
            }
            return Promise.reject(error);
        });
        // Add response interceptor for detailed logging
        this.client.interceptors.response.use((response) => {
            if (this.shouldLogVerbose()) {
                console.log('✅ OLLAMA RESPONSE INTERCEPTOR');
                console.log('📊 Status:', response.status, response.statusText);
                console.log('⏱️  Response Time:', response.config?.timeout || 'unknown');
                console.log('📦 Data Size:', JSON.stringify(response.data).length, 'bytes');
            }
            return response;
        }, (error) => {
            if (this.shouldLogVerbose()) {
                console.log('❌ OLLAMA RESPONSE ERROR:', error.message);
                if (error.response) {
                    console.log('📊 Error Status:', error.response.status);
                    console.log('📦 Error Data:', error.response.data);
                }
            }
            return Promise.reject(error);
        });
        this.testConnection();
        this.setupReconnectMonitoring();
    }
    shouldLogVerbose() {
        return process.env.DEBUG_OLLAMA === 'true' || process.env.DEBUG_HTTP === 'true' || process.env.NODE_ENV === 'development';
    }
    logConnectionDetails() {
        console.log("\n🦙 OLLAMA SERVICE INITIALIZATION");
        console.log('📍 Base URL:', this.baseUrl);
        console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
        console.log('🔍 Debug Mode:', this.shouldLogVerbose() ? 'ENABLED' : 'DISABLED');
        console.log('📊 Available Environment Variables:');
        console.log('   - OLLAMA_URL:', process.env.OLLAMA_URL || 'not set (using default)');
        console.log('   - DEBUG_OLLAMA:', process.env.DEBUG_OLLAMA || 'not set');
        console.log('   - DEBUG_HTTP:', process.env.DEBUG_HTTP || 'not set');
        console.log('');
    }
    recordConnectionAttempt(url, success, responseTime, error) {
        const attempt = {
            timestamp: new Date(),
            url,
            success,
            responseTime,
            error
        };
        this.connectionAttempts.push(attempt);
        // Keep only last 50 attempts
        if (this.connectionAttempts.length > 50) {
            this.connectionAttempts.shift();
        }
        if (success) {
            this.lastSuccessfulConnection = new Date();
        }
    }
    async testConnection() {
        const startTime = Date.now();
        const testUrl = `${this.baseUrl}/api/tags`;
        console.log("\n🦙 OLLAMA CONNECTION TEST");
        console.log('🔍 Testing connection to:', testUrl);
        console.log('⏱️  Timeout set to: 60000ms');
        try {
            console.log('📡 Sending GET request...');
            const response = await this.client.get('/api/tags');
            const responseTime = Date.now() - startTime;
            this.connected = true;
            this.recordConnectionAttempt(testUrl, true, responseTime);
            console.log('✅ OLLAMA CONNECTION SUCCESS');
            console.log('⏱️  Response Time:', responseTime + 'ms');
            console.log('📊 Status:', response.status, response.statusText);
            console.log('🔢 Models Available:', response.data?.models?.length || 0);
            if (this.shouldLogVerbose() && response.data?.models) {
                console.log('📋 Available Models:');
                response.data.models.forEach((model, index) => {
                    console.log(`   ${index + 1}. ${model.name} (${model.size ? (model.size / 1e9).toFixed(1) + 'GB' : 'unknown size'})`);
                });
            }
            console.log("🦙 Connected to Ollama successfully\n");
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            this.connected = false;
            this.recordConnectionAttempt(testUrl, false, responseTime, error.message);
            console.log('❌ OLLAMA CONNECTION FAILED');
            console.log('⏱️  Failed after:', responseTime + 'ms');
            console.log('🚫 Error Details:');
            console.log('   - Message:', error.message);
            console.log('   - Code:', error.code || 'unknown');
            console.log('   - URL Attempted:', testUrl);
            if (error.response) {
                console.log('   - HTTP Status:', error.response.status);
                console.log('   - HTTP Status Text:', error.response.statusText);
                console.log('   - Response Data:', error.response.data);
            }
            else if (error.request) {
                console.log('   - No response received');
                console.log('   - Request timeout or network error');
            }
            console.log("\n🔧 TROUBLESHOOTING SUGGESTIONS:");
            console.log('1. Ensure Ollama is running: `ollama serve`');
            console.log('2. Check if port 11434 is accessible');
            console.log('3. Verify OLLAMA_URL environment variable if using custom URL');
            console.log('4. Try: `curl ' + testUrl + '`');
            console.log('');
        }
    }
    setupReconnectMonitoring() {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
        }
        this.reconnectInterval = setInterval(() => {
            if (!this.connected) {
                console.log('🔄 Attempting Ollama reconnection...');
                this.testConnection();
            }
        }, 30000); // Try reconnecting every 30 seconds
    }
    isConnected() {
        return this.connected;
    }
    getConnectionStats() {
        const now = new Date();
        const recentAttempts = this.connectionAttempts.filter(attempt => now.getTime() - attempt.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
        );
        const successfulAttempts = recentAttempts.filter(attempt => attempt.success);
        const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
        return {
            connected: this.connected,
            baseUrl: this.baseUrl,
            lastSuccessfulConnection: this.lastSuccessfulConnection,
            totalAttempts: this.connectionAttempts.length,
            recentAttempts: recentAttempts.length,
            recentSuccesses: successfulAttempts.length,
            recentFailures: failedAttempts.length,
            averageResponseTime: successfulAttempts.length > 0
                ? successfulAttempts.reduce((sum, attempt) => sum + (attempt.responseTime || 0), 0) / successfulAttempts.length
                : null
        };
    }
    async getModels() {
        console.log('🦙 Fetching available models...');
        try {
            const response = await this.client.get('/api/tags');
            const models = response.data.models || [];
            console.log(`✅ Retrieved ${models.length} models`);
            return models;
        }
        catch (error) {
            console.log('❌ Failed to fetch models:', error.message);
            return [];
        }
    }
    async *streamChat(request) {
        console.log(`🦙 Starting stream chat with model: ${request.model}`);
        try {
            const response = await this.client.post('/api/chat', {
                ...request,
                stream: true
            }, {
                responseType: 'stream'
            });
            let buffer = '';
            let tokenCount = 0;
            for await (const chunk of response.data) {
                buffer += chunk.toString();
                const lines = buffer.split("\n");
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            tokenCount++;
                            if (this.shouldLogVerbose()) {
                                console.log(`🔄 Stream token ${tokenCount}:`, data.message?.content?.substring(0, 50) || 'no content');
                            }
                            yield data;
                        }
                        catch (parseError) {
                            console.warn('⚠️  Failed to parse stream chunk:', parseError);
                        }
                    }
                }
            }
            console.log(`✅ Stream completed with ${tokenCount} tokens`);
        }
        catch (error) {
            console.log('❌ Stream chat failed:', error.message);
            throw new Error('Chat streaming failed: ' + error.message);
        }
    }
    async chat(request) {
        console.log(`🦙 Starting chat with model: ${request.model}`);
        // Validate model access
        if (this.modelRegistry) {
            const validation = await this.modelRegistry.validateModelAccess(request.model);
            if (!validation.allowed) {
                throw new Error(`Model validation failed: ${validation.reason}. Suggested alternatives: ${validation.suggestedAlternatives?.join(", ") || "none"}`);
            }
        }
        try {
            const startTime = Date.now();
            const response = await this.client.post('/api/chat', {
                ...request,
                stream: false
            });
            const duration = Date.now() - startTime;
            console.log(`✅ Chat completed in ${duration}ms`);
            if (this.shouldLogVerbose()) {
                console.log('📦 Response content length:', response.data?.message?.content?.length || 0);
            }
            return response.data;
        }
        catch (error) {
            console.log('❌ Chat failed:', error.message);
            throw new Error('Chat failed: ' + error.message);
        }
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    async getModelInfo(modelName) {
        console.log(`🦙 Getting info for model: ${modelName}`);
        try {
            const response = await this.client.get("/api/show", {
                params: { name: modelName }
            });
            console.log(`✅ Model info retrieved for ${modelName}`);
            return response.data;
        }
        catch (error) {
            console.log(`❌ Failed to get model info for ${modelName}:`, error.message);
            return null;
        }
    }
    async pullModel(modelName) {
        console.log(`🦙 Pulling model: ${modelName}`);
        try {
            await this.client.post("/api/pull", { name: modelName });
            console.log(`✅ Model ${modelName} pulled successfully`);
            return true;
        }
        catch (error) {
            console.log(`❌ Failed to pull model ${modelName}:`, error.message);
            return false;
        }
    }
    async checkModel(modelName) {
        const models = await this.getModels();
        const hasModel = models.some(model => model.name === modelName);
        console.log(`🦙 Model ${modelName} ${hasModel ? 'found' : 'not found'}`);
        return hasModel;
    }
    destroy() {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
        }
        console.log('🦙 Ollama service destroyed');
    }
}
exports.OllamaService = OllamaService;
//# sourceMappingURL=ollama-service.js.map