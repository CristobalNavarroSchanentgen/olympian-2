FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/client/package.json ./packages/client/

RUN npm ci

COPY packages/shared/ ./packages/shared/
COPY packages/client/ ./packages/client/

RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/client

FROM nginx:alpine

COPY --from=builder /app/packages/client/dist /usr/share/nginx/html
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
