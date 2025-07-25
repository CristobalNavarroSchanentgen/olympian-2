import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, BookOpen, Eye } from 'lucide-react';

interface ReasoningBlock {
  type: 'planning' | 'step' | 'conclusion';
  title: string;
  content: string;
  duration?: number;
}

interface ReasoningMetadata {
  duration: number;
  wordCount: number;
  estimatedReadingTime: number;
}

interface ReasoningPanelProps {
  blocks: ReasoningBlock[];
  metadata: ReasoningMetadata;
  expanded: boolean;
  onToggle: () => void;
}

export function ReasoningPanel({ blocks, metadata, expanded, onToggle }: ReasoningPanelProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());

  const toggleBlock = (index: number) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBlocks(newExpanded);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getBlockIcon = (type: ReasoningBlock['type']) => {
    switch (type) {
      case 'planning':
        return <div className="w-8 h-8 flex items-center justify-center text-white text-xs font-medium bg-primary-blue rounded-full" />;
      case 'step':
        return <div className="w-8 h-8 flex items-center justify-center text-white text-xs font-medium bg-green-500 rounded-full" />;
      case 'conclusion':
        return <div className="w-8 h-8 flex items-center justify-center text-white text-xs font-medium bg-purple-500 rounded-full" />;
    }
  };

  return (
    <div className="reasoning-panel">
      {/* Reasoning Header */}
      <button
        onClick={onToggle}
        className="w-full reasoning-header flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-secondary" />
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary" />
          )}
          <span className="text-sm font-medium text-primary">AI Reasoning</span>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center space-x-4 text-xs text-secondary">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(metadata.duration)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-3 h-3" />
            <span>{metadata.wordCount} words</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{metadata.estimatedReadingTime}m read</span>
          </div>
        </div>
      </button>

      {/* Reasoning Content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {blocks.map((block, index) => (
            <div key={index} className="reasoning-block">
              <button
                onClick={() => toggleBlock(index)}
                className="w-full flex items-center justify-between p-3 hover:opacity-90 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getBlockIcon(block.type)}
                  <span className="text-sm font-medium text-primary capitalize">
                    {block.type}
                  </span>
                  <span className="text-sm text-secondary">{block.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {block.duration && (
                    <span className="text-xs text-secondary">
                      {formatDuration(block.duration)}
                    </span>
                  )}
                  {expandedBlocks.has(index) ? (
                    <ChevronDown className="w-4 h-4 text-secondary" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-secondary" />
                  )}
                </div>
              </button>
              
              {expandedBlocks.has(index) && (
                <div className="px-3 pb-3">
                  <div className="text-sm text-primary whitespace-pre-wrap bg-background-panel rounded-md p-4 font-mono">
                    {block.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
