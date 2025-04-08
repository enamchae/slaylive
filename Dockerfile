FROM node:20.5.1

COPY . .

RUN pnpm i --frozen-lockfile
RUN pnpm build:node

CMD ["node", "./build/node/index.js"]