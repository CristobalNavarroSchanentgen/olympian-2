FROM node:20-alpine

RUN apk add --no-cache python3 py3-pip curl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/shared/ ./packages/shared/
COPY packages/server/ ./packages/server/

# Build only server (shared will be pre-built)
RUN npm run build --workspace=packages/server

EXPOSE 3001

CMD ["npm", "start", "--workspace=packages/server"]
