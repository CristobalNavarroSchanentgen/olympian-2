/**
 * Token Counter Utility
 * Pure functions for counting tokens
 */

export interface TokenCount {
  prompt: number;
  completion: number;
  total: number;
}

export interface TokenBreakdown {
  messages: number;
  context: number;
  system: number;
  images: number;
  total: number;
}

export function countTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

export function countMessageTokens(content: string, role: string = 'user'): TokenCount {
  const contentTokens = countTokens(content);
  const roleTokens = countTokens(role);
  const formatTokens = 4; // For message formatting

  const total = contentTokens + roleTokens + formatTokens;
  
  return {
    prompt: role === 'user' ? total : 0,
    completion: role === 'assistant' ? total : 0,
    total
  };
}

export function calculateTokenBreakdown(messages: any[]): TokenBreakdown {
  let messagesTokens = 0;
  let contextTokens = 0;
  let systemTokens = 0;
  let imagesTokens = 0;

  for (const message of messages) {
    const tokens = countTokens(message.content || '');
    
    switch (message.role) {
      case 'system':
        systemTokens += tokens;
        break;
      case 'user':
      case 'assistant':
        messagesTokens += tokens;
        break;
      default:
        contextTokens += tokens;
    }

    // Count image tokens (rough estimate)
    if (message.images && Array.isArray(message.images)) {
      imagesTokens += message.images.length * 765; // ~765 tokens per image
    }
  }

  return {
    messages: messagesTokens,
    context: contextTokens,
    system: systemTokens,
    images: imagesTokens,
    total: messagesTokens + contextTokens + systemTokens + imagesTokens
  };
}
