FROM node:20-alpine

RUN apk add --no-cache python3 py3-pip curl

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/

RUN npm ci --only=production

COPY packages/shared/ ./packages/shared/
COPY packages/server/ ./packages/server/

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/server

EXPOSE 3001

CMD ["npm", "start", "--workspace=packages/server"]
