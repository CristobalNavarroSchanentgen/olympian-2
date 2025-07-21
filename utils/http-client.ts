/**
 * HTTP client utility - pure functions for HTTP operations
 */

export interface HttpRequest {
  readonly url: string;
  readonly method: HttpMethod;
  readonly headers?: Record<string, string>;
  readonly body?: string;
  readonly timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export interface HttpResponse {
  readonly status: number;
  readonly statusText: string;
  readonly headers: Record<string, string>;
  readonly body: string;
  readonly ok: boolean;
}

export interface HttpError {
  readonly code: string;
  readonly message: string;
  readonly status?: number;
  readonly response?: HttpResponse;
}

/**
 * Build HTTP request configuration
 */
export function buildRequest(
  url: string,
  method: HttpMethod = 'GET',
  options: Partial<HttpRequest> = {}
): HttpRequest {
  return {
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body,
    timeout: options.timeout || 10000
  };
}

/**
 * Build Ollama API request
 */
export function buildOllamaRequest(
  endpoint: string,
  path: string,
  body?: unknown
): HttpRequest {
  const url = \`\${endpoint.replace(/\/$/, '')}/\${path.replace(/^\//, '')}\`;
  
  return buildRequest(url, body ? 'POST' : 'GET', {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Parse HTTP error from response
 */
export function parseHttpError(
  response: HttpResponse,
  context?: string
): HttpError {
  const message = context 
    ? \`\${context}: \${response.statusText}\`
    : response.statusText;
  
  return {
    code: getErrorCode(response.status),
    message,
    status: response.status,
    response
  };
}

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const entries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(String(value))}\`);
  
  return entries.length > 0 ? \`?\${entries.join('&')}\` : '';
}

/**
 * Parse response content type
 */
export function parseContentType(headers: Record<string, string>): string {
  const contentType = headers['content-type'] || headers['Content-Type'] || '';
  return contentType.split(';')[0].trim().toLowerCase();
}

/**
 * Check if response is JSON
 */
export function isJsonResponse(response: HttpResponse): boolean {
  const contentType = parseContentType(response.headers);
  return contentType === 'application/json';
}

/**
 * Check if request should be retried
 */
export function shouldRetryRequest(
  status: number,
  retryCount: number,
  maxRetries: number = 3
): boolean {
  if (retryCount >= maxRetries) {
    return false;
  }
  
  // Retry on server errors and specific client errors
  return status >= 500 || status === 429 || status === 408;
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(retryCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds
  
  const delay = baseDelay * Math.pow(2, retryCount);
  return Math.min(delay, maxDelay);
}

function getErrorCode(status: number): string {
  if (status >= 500) return 'SERVER_ERROR';
  if (status === 429) return 'RATE_LIMITED';
  if (status === 408) return 'TIMEOUT';
  if (status === 404) return 'NOT_FOUND';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status >= 400) return 'CLIENT_ERROR';
  return 'UNKNOWN_ERROR';
}
