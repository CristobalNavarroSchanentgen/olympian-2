="text-muted-foreground">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          {systemStatus.ollama && <span className="text-green-600">🦙</span>}
          {systemStatus.mcp && <span className="text-blue-600">🔧</span>}
          {systemStatus.database && <span className="text-purple-600">📊</span>}
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          {filteredConversations.map((conversation) => (
            <Link
              key={conversation.id}
              to={`/chat/${conversation.id}`}
              className={`block p-3 rounded-lg mb-1 transition-colors ${
                currentConversationId === conversation.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="font-medium text-sm truncate">{conversation.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {conversation.model} • {new Date(conversation.updatedAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
