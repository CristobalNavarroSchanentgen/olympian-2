# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/client/package.json ./packages/client/

# Install all dependencies (including dev for build)
RUN npm ci --include=dev

# Copy source files and configurations
COPY packages/shared/ ./packages/shared/
COPY packages/client/ ./packages/client/
COPY tsconfig.json ./

# Build shared package first, then client
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/client

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
