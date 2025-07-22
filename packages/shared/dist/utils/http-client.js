"use strict";
/**
 * HTTP Client Utility
 * Pure functions for HTTP requests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = exports.httpClient = exports.HttpError = void 0;
exports.makeHttpRequest = makeHttpRequest;
exports.createHttpClient = createHttpClient;
class HttpError extends Error {
    status;
    statusText;
    data;
    constructor(message, status, statusText, data) {
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.data = data;
        this.name = 'HttpError';
    }
}
exports.HttpError = HttpError;
async function makeHttpRequest(url, config) {
    const startTime = Date.now();
    const { method = 'GET', headers = {}, body, timeout = 30000, retries = 3, retryDelay = 1000 } = config;
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            let data;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                data = await response.json();
            }
            else if (contentType.includes('text/')) {
                data = await response.text();
            }
            else {
                data = await response.arrayBuffer();
            }
            const duration = Date.now() - startTime;
            if (!response.ok) {
                throw new HttpError(`HTTP ${response.status}: ${response.statusText}`, response.status, response.statusText, data);
            }
            return {
                data: data,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                duration
            };
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < retries && !(error instanceof HttpError && error.status < 500)) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                continue;
            }
            throw lastError;
        }
    }
    throw lastError;
}
function createHttpClient(baseConfig = {}) {
    return {
        async request(url, config = {}) {
            return makeHttpRequest(url, { method: 'GET', ...baseConfig, ...config });
        },
        async get(url, config = {}) {
            return this.request(url, { ...config, method: 'GET' });
        },
        async post(url, body, config = {}) {
            return this.request(url, { ...config, method: 'POST', body });
        }
    };
}
exports.httpClient = createHttpClient();
exports.httpRequest = makeHttpRequest;
//# sourceMappingURL=http-client.js.map