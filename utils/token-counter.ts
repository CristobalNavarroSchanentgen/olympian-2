/**
 * Token counting utility - pure function
 * Estimates token count for various models
 */

export interface TokenCount {
  readonly tokens: number;
  readonly characters: number;
  readonly words: number;
}

export interface TokenCountOptions {
  readonly model?: string;
  readonly encoding?: 'gpt' | 'claude' | 'llama';
}

/**
 * Count tokens in text content
 */
export function countTokens(
  content: string, 
  options: TokenCountOptions = {}
): TokenCount {
  const characters = content.length;
  const words = content.trim().split(/\s+/).length;
  
  // Simple estimation - 4 characters per token average
  // Different models have different ratios
  const ratio = getTokenRatio(options.encoding || 'gpt');
  const tokens = Math.ceil(characters / ratio);
  
  return {
    tokens,
    characters,
    words
  };
}

/**
 * Count tokens in multiple text pieces
 */
export function countTokensBatch(
  contents: string[], 
  options: TokenCountOptions = {}
): TokenCount {
  const results = contents.map(content => countTokens(content, options));
  
  return results.reduce((total, current) => ({
    tokens: total.tokens + current.tokens,
    characters: total.characters + current.characters,
    words: total.words + current.words
  }), { tokens: 0, characters: 0, words: 0 });
}

/**
 * Check if content fits within token limit
 */
export function fitsInTokenLimit(
  content: string, 
  limit: number, 
  options: TokenCountOptions = {}
): boolean {
  const count = countTokens(content, options);
  return count.tokens <= limit;
}

/**
 * Truncate content to fit token limit
 */
export function truncateToTokenLimit(
  content: string, 
  limit: number, 
  options: TokenCountOptions = {}
): string {
  if (fitsInTokenLimit(content, limit, options)) {
    return content;
  }
  
  const ratio = getTokenRatio(options.encoding || 'gpt');
  const maxChars = Math.floor(limit * ratio);
  
  return content.substring(0, maxChars);
}

function getTokenRatio(encoding: string): number {
  switch (encoding) {
    case 'gpt': return 4;
    case 'claude': return 3.5;
    case 'llama': return 4.5;
    default: return 4;
  }
}
