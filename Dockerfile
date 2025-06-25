FROM node:20.5.1-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm@10.11.1
COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build:node

FROM base
COPY --from=prod-deps /node_modules /node_modules
COPY --from=build /build /build
EXPOSE 8080
CMD ["node", "./build/node/index.js"]