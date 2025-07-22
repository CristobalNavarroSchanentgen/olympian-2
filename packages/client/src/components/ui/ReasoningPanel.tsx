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
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'step':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'conclusion':
        return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
    }
  };

  return (
    <div className="border-t border-border bg-muted/20">
      {/* Reasoning Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">AI Reasoning</span>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
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
            <div key={index} className="border border-border rounded-lg bg-background/50">
              <button
                onClick={() => toggleBlock(index)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getBlockIcon(block.type)}
                  <span className="text-sm font-medium text-foreground capitalize">
                    {block.type}
                  </span>
                  <span className="text-sm text-muted-foreground">{block.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {block.duration && (
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(block.duration)}
                    </span>
                  )}
                  {expandedBlocks.has(index) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              {expandedBlocks.has(index) && (
                <div className="px-3 pb-3">
                  <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded p-3 font-mono">
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
