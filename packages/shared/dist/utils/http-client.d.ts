/**
 * HTTP Client Utility
 * Pure functions for HTTP requests
 * Follows AI-Native architecture - utility functions only
 */
/**
 * HTTP request configuration
 */
export interface HttpRequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}
/**
 * HTTP response wrapper
 */
export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    duration: number;
}
/**
 * HTTP client error
 */
export declare class HttpClientError extends Error {
    status?: number | undefined;
    response?: Response | undefined;
    constructor(message: string, status?: number | undefined, response?: Response | undefined);
}
/**
 * Make HTTP request with configuration
 */
export declare function makeHttpRequest<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
/**
 * GET request helper
 */
export declare function get<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
/**
 * POST request helper
 */
export declare function post<T = unknown>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
/**
 * PUT request helper
 */
export declare function put<T = unknown>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
/**
 * DELETE request helper
 */
export declare function del<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
/**
 * Check if URL is reachable
 */
export declare function ping(url: string, timeout?: number): Promise<boolean>;
/**
 * Create HTTP client with base configuration
 */
export declare function createHttpClient(baseConfig?: Partial<HttpRequestConfig>): {
    request<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    get<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    post<T = unknown>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    put<T = unknown>(url: string, body?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    delete<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
};
//# sourceMappingURL=http-client.d.ts.map