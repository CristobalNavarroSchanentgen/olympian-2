import { Bot, MessageSquare, Settings, Zap, Sparkles, Brain, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-panel/20 to-accent/10 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center max-w-2xl px-8 relative z-10">
        <div className="mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl mb-6">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Welcome to Olympian AI</h1>
          <p className="text-muted text-xl">
            Experience the future of AI conversations with integrated tools and vision capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-slide-up animation-delay-200">
          <div className="bg-panel/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-primary">Smart Conversations</h3>
              <p className="text-sm text-muted text-center">Real-time streaming with context awareness</p>
            </div>
          </div>

          <div className="bg-panel/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-primary">MCP Integration</h3>
              <p className="text-sm text-muted text-center">Execute tools and access external services</p>
            </div>
          </div>

          <div className="bg-panel/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Brain className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-primary">Vision AI</h3>
              <p className="text-sm text-muted text-center">Process and understand images naturally</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-slide-up animation-delay-400">
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/config"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-panel border border-border/50 hover:bg-accent/20 transition-all duration-200 hover:scale-105"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Configure Settings</span>
            </Link>
            
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg transition-all duration-200 hover:scale-105">
              <Rocket className="h-5 w-5" />
              <span className="font-medium">Quick Start Guide</span>
            </button>
          </div>

          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create a new chat or select from the sidebar to begin
          </p>
        </div>
      </div>
    </div>
  );
}
