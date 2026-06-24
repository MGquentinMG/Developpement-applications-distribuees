FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --chown=appuser:appgroup package*.json ./
RUN npm install --only=production

COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 5000

CMD ["node", "src/server.js"]
