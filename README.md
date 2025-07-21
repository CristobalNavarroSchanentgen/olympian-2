# 🏛️ Olympian AI - Lightweight

An AI-native chat application with integrated MCP (Model Context Protocol) servers, featuring real-time streaming, vision processing, and artifact management.

## ✨ Features

- **🔄 Real-time Chat**: WebSocket-based streaming with typewriter effects
- **🛠️ MCP Integration**: NASA, GitHub, Museums, and Documentation tools
- **👁️ Vision Processing**: Multi-image upload with AI vision capabilities  
- **📝 Artifact Management**: Create and manage code, documents, and media
- **🎨 Modern UI**: Responsive design with light/dark themes
- **🐳 Self-Contained**: All MCP servers run within the application container
- **📊 System Monitoring**: Real-time status of all services and connections

## 🏗️ Architecture

Built with an AI-native architecture that prioritizes context minimization:

- **Monorepo**: `/packages/client` (React), `/packages/server` (Node.js), `/packages/shared` (Business Logic)
- **Containers**: Frontend, Backend with integrated MCP servers, MongoDB
- **MCP Servers**: stdio-based processes for NASA, GitHub, Museums, Documentation
- **Single Ollama**: Connects to one configured Ollama instance

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+
- Access to an Ollama instance

### Installation

1. **Setup Configuration**
   ```bash
   make setup
   ```
   This will prompt you for:
   - Ollama URL (default: http://localhost:11434)
   - Model capability detection preference
   - API tokens for MCP servers (NASA, GitHub)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Deploy Everything**
   ```bash
   make quick-docker-multi
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: mongodb://localhost:27017

## 🛠️ Development

### Available Commands

```bash
# Setup and deployment
make setup                 # Interactive configuration
make install              # Install dependencies
make dev                  # Start development servers
make build                # Build all packages
make quick-docker-multi   # Build and deploy containers

# Docker management
make docker-build         # Build Docker images
make docker-up           # Start containers
make docker-down         # Stop containers
make logs                # View container logs
make status              # Check container status
make clean               # Clean up everything
```

### Project Structure

```
olympian-2/
├── packages/
│   ├── client/          # React frontend
│   ├── server/          # Node.js backend with MCP
│   └── shared/          # Business logic & types
├── scripts/             # Setup and utility scripts
├── docker-compose.yml   # Container orchestration
├── Makefile            # Automation commands
└── mcp.config.json     # MCP server definitions
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
OLLAMA_URL=http://localhost:11434
NASA_API_KEY=your_nasa_key
GITHUB_TOKEN=your_github_token
```

### MCP Servers (mcp.config.json)
```json
{
  "servers": {
    "met-museum": {
      "command": "npx",
      "args": ["-y", "metmuseum-mcp"]
    },
    "nasa-mcp": {
      "command": "npx",
      "args": ["-y", "@programcomputer/nasa-mcp-server@latest"],
      "env": { "NASA_API_KEY": "your_key" }
    }
  }
}
```

## 🎯 Usage

### Starting a Conversation
1. Open http://localhost:3000
2. Click "New Chat" in the sidebar
3. Type your message and press Enter
4. AI responds with streaming text

### Using MCP Tools
- Tools are automatically available in chat context
- AI can access NASA data, GitHub repos, museum collections
- Tool execution is transparent and real-time

### Image Processing
- Drag and drop images into the chat input
- AI can analyze and describe images
- Supports multiple image formats

### System Configuration
- Visit `/config` to view system status
- Monitor MCP server health
- Check Ollama connection status
- Adjust theme and settings

## 🔍 Monitoring

### System Health
- **Database**: MongoDB connection and replica set status
- **MCP Servers**: Process health and tool availability  
- **Ollama**: Model availability and connection status
- **WebSocket**: Real-time connection status

### Logs
```bash
make logs              # All container logs
docker logs olympian-server    # Backend logs
docker logs olympian-client    # Frontend logs  
docker logs olympian-mongodb   # Database logs
```

## 🏛️ AI-Native Architecture

This project implements an AI-native architecture optimized for AI comprehension:

- **Context Minimization**: Every feature understandable with ≤3 files
- **Immutable Contracts**: Features communicate through stable interfaces
- **Perfect Isolation**: Features are black boxes to each other
- **Single Responsibility**: Each component has one clear purpose

### Key Principles
- Business logic in `/packages/shared` 
- Contract-driven development
- No cross-feature dependencies
- Minimal context requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the AI-native architecture principles
4. Test with `make dev`
5. Submit a pull request

## 📜 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Check `/config` page for system status
- Review container logs with `make logs`
- Ensure Ollama is running and accessible
- Verify MCP server configurations

---

**Built with ❤️ using AI-native architecture principles**
