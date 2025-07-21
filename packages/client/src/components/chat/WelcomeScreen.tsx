import { Bot, MessageSquare, Settings, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="text-center max-w-md px-8">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Olympian AI</h1>
          <p className="text-muted-foreground text-lg">
            Your AI-native chat assistant with integrated MCP servers
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>Real-time streaming conversations</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Integrated MCP tool execution</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Bot className="h-5 w-5 text-green-500" />
            <span>Vision processing capabilities</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Select a conversation from the sidebar or create a new one to get started
          </p>
          <Link
            to="/config"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
          >
            <Settings className="h-4 w-4" />
            Configure Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
