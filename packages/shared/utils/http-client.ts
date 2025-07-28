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
  ok: boolean;  duration: number;
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

// Debug logging configuration
const DEBUG_HTTP = process.env.DEBUG_HTTP === 'true' || process.env.NODE_ENV === 'development';
const DEBUG_OLLAMA = process.env.DEBUG_OLLAMA === 'true';

function isOllamaRequest(url: string): boolean {
  return url.includes('11434') || url.includes('/api/') || url.toLowerCase().includes('ollama');
}

function logRequest(url: string, config: HttpRequestConfig, requestId: string): void {
  if (!DEBUG_HTTP && !(DEBUG_OLLAMA && isOllamaRequest(url))) return;
  
  const isOllama = isOllamaRequest(url);
  const prefix = isOllama ? '🦙 OLLAMA' : '🌐 HTTP';
  
  console.log(`
${prefix} REQUEST [${requestId}]`);
  console.log(`📍 URL: ${config.method || 'GET'} ${url}`);
  console.log(`⏱️  Timeout: ${config.timeout || 30000}ms`);
  
  if (config.headers && Object.keys(config.headers).length > 0) {
    console.log('📋 Headers:', JSON.stringify(config.headers, null, 2));
  }
  
  if (config.body) {
    const bodyStr = typeof config.body === 'string' 
      ? config.body 
      : JSON.stringify(config.body, null, 2);
    
    // Truncate very long bodies for readability
    const displayBody = bodyStr.length > 1000 
      ? bodyStr.substring(0, 1000) + '... (truncated)'
      : bodyStr;
      
    console.log('📦 Body:', displayBody);
  }
  
  console.log('🔄 Starting request...');
}

function logResponse(url: string, response: any, duration: number, requestId: string): void {
  if (!DEBUG_HTTP && !(DEBUG_OLLAMA && isOllamaRequest(url))) return;
  
  const isOllama = isOllamaRequest(url);
  const prefix = isOllama ? '🦙 OLLAMA' : '🌐 HTTP';
  const statusEmoji = response.status >= 200 && response.status < 300 ? '✅' : '❌';
  
  console.log(`
${prefix} RESPONSE [${requestId}] ${statusEmoji}`);
  console.log(`📊 Status: ${response.status} ${response.statusText}`);
  console.log(`⏱️  Duration: ${duration}ms`);
  
  if (response.headers && Object.keys(response.headers).length > 0) {
    console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
  }
  
  // Log response data (with size limits for readability)
  if (response.data) {
    const dataStr = typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data, null, 2);
    
    const displayData = dataStr.length > 2000 
      ? dataStr.substring(0, 2000) + '... (truncated)'
      : dataStr;
      
    console.log('📦 Response Data:', displayData);
  }
  
    console.log("✨ Request completed\n");
}

function logError(url: string, error: Error, attempt: number, requestId: string): void {
  if (!DEBUG_HTTP && !(DEBUG_OLLAMA && isOllamaRequest(url))) return;
  
  const isOllama = isOllamaRequest(url);
  const prefix = isOllama ? '🦙 OLLAMA' : '🌐 HTTP';
  
  console.log(`
${prefix} ERROR [${requestId}] ❌`);
  console.log(`🔄 Attempt: ${attempt + 1}`);
  console.log(`❗ Error: ${error.message}`);
  
  if (error instanceof HttpError) {
    console.log(`📊 HTTP Status: ${error.status}`);
    if (error.data) {
      console.log('📦 Error Data:', JSON.stringify(error.data, null, 2));
    }
  }
  
  console.log(`🔗 URL: ${url}`);
  console.log('');
}

export async function makeHttpRequest<T = unknown>(
  url: string,
  config: HttpRequestConfig
): Promise<HttpResponse<T>> {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
    retries = 3,
    retryDelay = 1000
  } = config;

  logRequest(url, { method, headers, body, timeout }, requestId);

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
      const responseObj = {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        duration
        ,
        ok: response.ok      };
      
      logResponse(url, responseObj, duration, requestId);
      
      if (!response.ok) {
        const httpError = new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          data
        );
        logError(url, httpError, attempt, requestId);
        throw httpError;
      }
      
      return responseObj;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logError(url, lastError, attempt, requestId);
      
      if (attempt < retries && !(error instanceof HttpError && error.status < 500)) {
        const delay = retryDelay * (attempt + 1);
        if (DEBUG_HTTP || (DEBUG_OLLAMA && isOllamaRequest(url))) {
          console.log(`🔄 Retrying in ${delay}ms... (attempt ${attempt + 2}/${retries + 1})`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
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

export const httpRequest = makeHttpRequest;
