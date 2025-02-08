FROM node:alpine
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json /app/

COPY packages ./packages

COPY ./apps/worker ./apps/worker

RUN pnpm i

WORKDIR /app/packages/db

RUN pwd && ls -la

RUN npx prisma generate

WORKDIR /app

RUN pnpm build

# change to production like start , s
CMD [ "pnpm", "dev" ]