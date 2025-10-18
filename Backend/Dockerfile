# Етап 1: збірка
FROM node:22-bullseye AS builder

WORKDIR /app

COPY package*.json ./

# Встановлюємо build tools для bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN npm ci

COPY . .

RUN npm run build

# Етап 2: продакшн
FROM node:22-bullseye

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/templates ./src/templates
COPY --from=builder /app/package*.json ./

# Встановлюємо тільки продакшн-залежності
RUN npm ci --omit=dev

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
