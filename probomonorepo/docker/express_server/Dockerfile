FROM node:alpine
WORKDIR /app

RUN npm install -g pnpm

# file type copy - will be there with same name (using mutlipsrc syntax ,must end with /)
COPY package.json pnpm-lock.yaml pnpm-lock.yaml pnpm-workspace.yaml turbo.json /app/

#dir type copy - will copy the content of the packages to the package(desitnation) dir

COPY packages ./packages

COPY ./apps/express_server ./apps/express_server

RUN pnpm i

WORKDIR /app/packages/db
RUN command pwd && ls -la
RUN npx prisma generate

WORKDIR /app

RUN pnpm build

EXPOSE 5001

CMD ["pnpm", "dev"]
# CMD [ "node", "index.js" ]