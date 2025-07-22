#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🎯 Olympian-2 AI-Native Chat Setup');
  console.log('=====================================
');

  const ollamaUrl = await question('🔗 Enter Ollama URL (default: http://localhost:11434): ') || 'http://localhost:11434';
  
  console.log('
🔍 Model Capability Detection:');
  console.log('1. Auto-scan (recommended)');
  console.log('2. Custom configuration');
  const detectionChoice = await question('Choose detection method (1 or 2): ');
  const autoScan = detectionChoice === '1' || detectionChoice === '';

  console.log('
🔑 MCP Server Configuration:');
  const nasaApiKey = await question('NASA API Key (optional): ');
  const githubToken = await question('GitHub Personal Access Token (optional): ');

  const envContent = `NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://root:olympian123@localhost:27017/olympian?authSource=admin&replicaSet=rs0
CLIENT_URL=http://localhost:3000
OLLAMA_URL=${ollamaUrl}
AUTO_SCAN_MODELS=${autoScan}
NASA_API_KEY=${nasaApiKey}
GITHUB_TOKEN=${githubToken}
`;

  fs.writeFileSync('../.env', envContent);

  const mcpConfig = {
    servers: {
      "met-museum": {
        command: "npx",
        args: ["-y", "metmuseum-mcp"],
        env: {}
      },
      "nasa-mcp": {
        command: "npx",
        args: ["-y", "@programcomputer/nasa-mcp-server@latest"],
        env: nasaApiKey ? { NASA_API_KEY: nasaApiKey } : {}
      },
      "github": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-github"],
        env: githubToken ? { GITHUB_PERSONAL_ACCESS_TOKEN: githubToken } : {}
      },
      "context7": {
        command: "npx",
        args: ["-y", "@upstash/context7-mcp"],
        env: {}
      }
    }
  };

  fs.writeFileSync('../mcp.config.json', JSON.stringify(mcpConfig, null, 2));

  console.log('
✅ Setup complete!');
  console.log('📁 Created .env file');
  console.log('📁 Created mcp.config.json');
  console.log('
🚀 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: make quick-docker-multi');

  rl.close();
}

setup().catch(console.error);
