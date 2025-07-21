/**
 * HTTP Client Utility
 * Pure functions for HTTP requests
 */

export interface HttpRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  duration: number;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function makeHttpRequest<T = unknown>(
  url: string,
  config: HttpRequestConfig
): Promise<HttpResponse<T>> {
  const startTime = Date.now();
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
    retries = 3,
    retryDelay = 1000
  } = config;

  let lastError: Error;
  
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
      
      let data: any;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.arrayBuffer();
      }
      
      const duration = Date.now() - startTime;
      
      if (!response.ok) {
        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          data
        );
      }
      
      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        duration
      };
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < retries && !(error instanceof HttpError && error.status < 500)) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
      
      throw lastError;
    }
  }
  
  throw lastError!;
}

export function createHttpClient(baseConfig: Partial<HttpRequestConfig> = {}) {
  return {
    async request<T = unknown>(
      url: string,
      config: Partial<HttpRequestConfig> = {}
    ): Promise<HttpResponse<T>> {
      return makeHttpRequest<T>(url, { method: 'GET', ...baseConfig, ...config });
    },
    
    async get<T = unknown>(url: string, config: Partial<HttpRequestConfig> = {}): Promise<HttpResponse<T>> {
      return this.request<T>(url, { ...config, method: 'GET' });
    },
    
    async post<T = unknown>(url: string, body: unknown, config: Partial<HttpRequestConfig> = {}): Promise<HttpResponse<T>> {
      return this.request<T>(url, { ...config, method: 'POST', body });
    }
  };
}

export const httpClient = createHttpClient();
