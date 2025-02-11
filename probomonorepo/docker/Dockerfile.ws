FROM node:alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json /app/
COPY packages ./packages

COPY apps/ws-server ./apps/ws-server

RUN pnpm i

RUN pnpm build

EXPOSE 8080

CMD [ "pnpm", "dev" ]
