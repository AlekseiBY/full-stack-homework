# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
