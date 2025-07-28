/**
 * HTTP Client Utility
 * Pure functions for HTTP requests with verbose logging support
 */
export interface HttpRequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    debug?: boolean;
}
export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    ok: boolean;
    duration: number;
}
export declare class HttpError extends Error {
    status: number;
    statusText: string;
    data?: unknown | undefined;
    constructor(message: string, status: number, statusText: string, data?: unknown | undefined);
}
export declare function makeHttpRequest<T = unknown>(url: string, config: HttpRequestConfig): Promise<HttpResponse<T>>;
export declare function createHttpClient(baseConfig?: Partial<HttpRequestConfig>): {
    request<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    get<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    post<T = unknown>(url: string, body: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
};
export declare const httpClient: {
    request<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    get<T = unknown>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
    post<T = unknown>(url: string, body: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
};
export declare const httpRequest: typeof makeHttpRequest;
//# sourceMappingURL=http-client.d.ts.map