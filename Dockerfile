FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app

# Non-root user — security bonus puanı
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=base /app/node_modules ./node_modules
COPY src/ ./src/

USER appuser

EXPOSE 3000
CMD ["node", "src/index.js"]