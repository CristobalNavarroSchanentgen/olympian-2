"use strict";
/**
 * HTTP Client Utility
 * Pure functions for HTTP requests
 * Follows AI-Native architecture - utility functions only
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientError = void 0;
exports.makeHttpRequest = makeHttpRequest;
exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;
exports.ping = ping;
exports.createHttpClient = createHttpClient;
/**
 * HTTP client error
 */
class HttpClientError extends Error {
    status;
    response;
    constructor(message, status, response) {
        super(message);
        this.status = status;
        this.response = response;
        this.name = 'HttpClientError';
    }
}
exports.HttpClientError = HttpClientError;
/**
 * Make HTTP request with configuration
 */
async function makeHttpRequest(url, config = { method: 'GET' }) {
    const startTime = Date.now();
    let lastError = null;
    const maxRetries = config.retries || 0;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeout = config.timeout || 10000;
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const fetchConfig = {
                method: config.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                signal: controller.signal
            };
            if (config.body && config.method !== 'GET') {
                fetchConfig.body = typeof config.body === 'string'
                    ? config.body
                    : JSON.stringify(config.body);
            }
            const response = await fetch(url, fetchConfig);
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new HttpClientError(`HTTP Error: ${response.status} ${response.statusText}`, response.status, response);
            }
            const contentType = response.headers.get('content-type') || '';
            let data;
            if (contentType.includes('application/json')) {
                data = await responseon();
            }
            else if (contentType.includes('text/')) {
                data = await response.text();
            }
            else {
                data = await response.arrayBuffer();
            }
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });
            return {
                data,
                status: response.status,
                statusText: response.statusText,
                headers,
                duration: Date.now() - startTime
            };
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            if (attempt < maxRetries) {
                const delay = config.retryDelay || 1000 * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            break;
        }
    }
    throw lastError || new Error('Request failed');
}
/**
 * GET request helper
 */
async function get(url, config) {
    return makeHttpRequest(url, { ...config, method: 'GET' });
}
/**
 * POST request helper
 */
async function post(url, body, config) {
    return makeHttpRequest(url, { ...config, method: 'POST', body });
}
/**
 * PUT request helper
 */
async function put(url, body, config) {
    return makeHttpRequest(url, { ...config, method: 'PUT', body });
}
/**
 * DELETE request helper
 */
async function del(url, config) {
    return makeHttpRequest(url, { ...config, method: 'DELETE' });
}
/**
 * Check if URL is reachable
 */
async function ping(url, timeout = 5000) {
    try {
        const response = await makeHttpRequest(url, {
            method: 'GET',
            timeout
        });
        return response.status < 400;
    }
    catch {
        return false;
    }
}
/**
 * Create HTTP client with base configuration
 */
function createHttpClient(baseConfig = {}) {
    return {
        async request(url, config = {}) {
            return makeHttpRequest(url, { ...baseConfig, ...config });
        },
        async get(url, config) {
            return this.request(url, { ...config, method: 'GET' });
        },
        async post(url, body, config) {
            return this.request(url, { ...config, method: 'POST', body });
        },
        async put(url, body, config) {
            return this.request(url, { ...config, method: 'PUT', body });
        },
        async delete(url, config) {
            return this.request(url, { ...config, method: 'DELETE' });
        }
    };
}
//# sourceMappingURL=http-client.js.map