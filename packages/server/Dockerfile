# syntax=docker/dockerfile:1

FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache python3 py3-pip curl git

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/

# Install all dependencies
RUN npm ci --include=dev

# Copy source files
COPY packages/shared/ ./packages/shared/
COPY packages/server/ ./packages/server/
COPY tsconfig.json ./

# Build shared package first, then server
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/server

# Clean up dev dependencies for production
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3001

USER node

CMD ["npm", "start", "--workspace=packages/server"]
