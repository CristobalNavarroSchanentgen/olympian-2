/**
 * Content Analysis Adapter - Server Implementation
 */

import { ContentAnalysisAdapter } from '@olympian/shared/features/chat/smart-model-router/contract';

const TOOL_KEYWORDS = [
  'calculate', 'compute', 'search', 'find', 'lookup', 'get', 'fetch',
  'analyze', 'parse', 'extract', 'process', 'convert', 'transform',
  'execute', 'run', 'call', 'invoke'
];

const REASONING_KEYWORDS = [
  'explain', 'why', 'how', 'reason', 'logic', 'think', 'analyze',
  'compare', 'contrast', 'evaluate', 'assess', 'judge', 'decide',
  'plan', 'strategy', 'approach', 'solve', 'problem', 'complex'
];

export class ContentAnalysisAdapterImpl implements ContentAnalysisAdapter {
  async analyzeTextComplexity(content: string) {
    const words = content.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    const hasToolKeywords = TOOL_KEYWORDS.some(keyword => content.toLowerCase().includes(keyword));
    const hasReasoningKeywords = REASONING_KEYWORDS.some(keyword => content.toLowerCase().includes(keyword));
    
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    if (avgWordsPerSentence > 20 || hasReasoningKeywords || words.length > 100) {
      complexity = 'complex';
    } else if (avgWordsPerSentence > 10 || hasToolKeywords || words.length > 50) {
      complexity = 'moderate';
    }
    
    const suggestedCapabilities: string[] = [];
    if (hasToolKeywords) suggestedCapabilities.push('tools');
    if (hasReasoningKeywords) suggestedCapabilities.push('reasoning');
    
    return { complexity, suggestedCapabilities };
  }

  async detectImageContent(images: string[]) {
    return {
      hasImages: images.length > 0,
      requiresProcessing: images.length > 0 && images.some(img => img.length > 100)
    };
  }


  // Implementation of missing contract methods
  async analyzeContent(content: string): Promise<any> {
    const complexity = await this.analyzeTextComplexity(content);
    const hasImages = content.includes("[image]") || content.includes("<img");
    
    let suggestedModel = "llama3.2:latest";
    if (hasImages) {
      suggestedModel = "llava:latest";
    } else if (complexity.complexity === "complex") {
      suggestedModel = "llama3.1:70b";
    }
    
    return {
      hasImages,
      complexity: complexity.complexity,
      suggestedModel
    };
  }

  async detectMediaType(content: string): Promise<any> {
    const hasImages = content.includes("[image]") || content.includes("<img");
    const hasText = content.replace(/\[image\]/g, "").trim().length > 0;
    
    if (hasImages && hasText) {
      return "mixed";
    } else if (hasImages) {
      return "image";
    } else {
      return "text";
    }
  }
}
