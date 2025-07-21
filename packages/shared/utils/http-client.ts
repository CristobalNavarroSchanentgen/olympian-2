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
export class HttpClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

/**
 * Make HTTP request with configuration
 */
export async function makeHttpRequest<T = unknown>(
  url: string,
  config: HttpRequestConfig = { method: 'GET' }
): Promise<HttpResponse<T>> {
  const startTime = Date.now();
  let lastError: Error | null = null;
  const maxRetries = config.retries || 0;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = config.timeout || 10000;
      
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const fetchConfig: RequestInit = {
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
        throw new HttpClientError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          response
        );
      }
      
      const contentType = response.headers.get('content-type') || '';
      let data: T;
      
      if (contentType.includes('application/json')) {
        data = await response();
      } else if (contentType.includes('text/')) {
        data = await response.text() as T;
      } else {
        data = await response.arrayBuffer() as T;
      }
      
      const headers: Record<string, string> = {};
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
      
    } catch (error) {
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
export async function get<T = unknown>(
  url: string,
  config: HttpRequestConfig = { method: "GET" }
): Promise<HttpResponse<T>> {
  return makeHttpRequest<T>(url, { ...config, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T = unknown>(
  url: string,
  body?: unknown,
  config: HttpRequestConfig = { method: "GET" }
): Promise<HttpResponse<T>> {
  return makeHttpRequest<T>(url, { ...config, method: 'POST', body });
}

/**
 * PUT request helper
 */
export async function put<T = unknown>(
  url: string,
  body?: unknown,
  config: HttpRequestConfig = { method: "GET" }
): Promise<HttpResponse<T>> {
  return makeHttpRequest<T>(url, { ...config, method: 'PUT', body });
}

/**
 * DELETE request helper
 */
export async function del<T = unknown>(
  url: string,
  config: HttpRequestConfig = { method: "GET" }
): Promise<HttpResponse<T>> {
  return makeHttpRequest<T>(url, { ...config, method: 'DELETE' });
}

/**
 * Check if URL is reachable
 */
export async function ping(url: string, timeout: number = 5000): Promise<boolean> {
  try {
    const response = await makeHttpRequest(url, {
      method: 'GET',
      timeout
    });
    return response.status < 400;
  } catch {
    return false;
  }
}

/**
 * Create HTTP client with base configuration
 */
export function createHttpClient(baseConfig: Partial<HttpRequestConfig> = {}) {
  return {
    async request<T = unknown>(
      url: string,
      config: Partial<HttpRequestConfig> = {}
    ): Promise<HttpResponse<T>> {
      return makeHttpRequest<T>(url, { ...baseConfig, ...config });
    },
    
    async get<T = unknown>(url: string, config: HttpRequestConfig = { method: "GET" }): Promise<HttpResponse<T>> {
      return this.request<T>(url, { ...config, method: 'GET' });
    },
    
    async post<T = unknown>(url: string, body?: unknown, config: HttpRequestConfig = { method: "GET" }): Promise<HttpResponse<T>> {
      return this.request<T>(url, { ...config, method: 'POST', body });
    },
    
    async put<T = unknown>(url: string, body?: unknown, config: HttpRequestConfig = { method: "GET" }): Promise<HttpResponse<T>> {
      return this.request<T>(url, { ...config, method: 'PUT', body });
    },
    
    async delete<T = unknown>(url: string, config: HttpRequestConfig = { method: "GET" }): Promise<HttpResponse<T>> {
      return this.request<T>(url, { ...config, method: 'DELETE' });
    }
  };
}
