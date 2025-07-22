import { FileText } from "lucide-react";

export function CodeEditor({ content = "" }: { content?: string }) {
  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      <div className="p-3 border-b border-border">
        <FileText className="w-4 h-4" />
      </div>
      <div className="flex-1 overflow-auto p-3">
        <pre className="text-sm font-mono">{content}</pre>
      </div>
    </div>
  );
}
