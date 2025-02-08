# do next js app require nodealpine image
FROM node:alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json /app/

COPY packages ./packages

COPY ./apps/frontend ./apps/frontend

RUN pnpm i
RUN build

WORKDIR /app/apps/frontend

CMD [ "pnpm","start" ]

