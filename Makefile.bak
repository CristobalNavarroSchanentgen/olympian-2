.PHONY: setup install dev build docker-build docker-up docker-down quick-docker-multi clean

setup:
	@echo "🚀 Starting Olympian-2 Setup (includes dependency installation)..."
	@node scripts/setup.js

# Note: install is included in setup, use this target only for reinstalling dependencies
install:
	@echo "📦 Installing dependencies..."
	@npm install
	@npm run build --workspace=packages/shared

dev:
	@echo "🔧 Starting development environment..."
	@npm run dev

build:
	@echo "🏗️  Building all packages..."
	@npm run build

docker-build:
	@echo "🐳 Building Docker images..."
	@docker-compose build

docker-up:
	@echo "🚀 Starting Docker services..."
	@docker-compose up -d

docker-down:
	@echo "🛑 Stopping Docker services..."
	@docker-compose down

quick-docker-multi: build docker-build docker-up
	@echo "⚡ Quick multi-container deployment complete!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:3001"
	@echo "🗄️  MongoDB: mongodb://localhost:27017"

clean:
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@docker system prune -f
	@rm -rf packages/*/dist packages/*/node_modules node_modules

logs:
	@docker-compose logs -f

status:
	@docker-compose ps
