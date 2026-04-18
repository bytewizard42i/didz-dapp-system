# DIDz.io — Identity Provider API container
# Build:   docker build -t didz-identity-provider:dev .
# Run:     docker run -p 3000:3000 --env-file .env didz-identity-provider:dev

FROM node:22-alpine AS builder
WORKDIR /app

# Enable Yarn 4 via corepack
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml* ./
COPY .yarn ./.yarn
COPY tsconfig.base.json ./
COPY didz-api/package.json didz-api/tsconfig.json didz-api/tsconfig.build.json ./didz-api/
COPY didz-api/src ./didz-api/src
COPY identity-provider-api/package.json identity-provider-api/tsconfig.json identity-provider-api/tsconfig.build.json ./identity-provider-api/
COPY identity-provider-api/src ./identity-provider-api/src

RUN yarn install --immutable
RUN yarn workspace @didz/didz-api build
RUN yarn workspace @didz/identity-provider-api build

# ----- Runtime stage -----
FROM node:22-alpine AS runtime
WORKDIR /app

RUN corepack enable
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml* ./
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/didz-api ./didz-api
COPY --from=builder /app/identity-provider-api ./identity-provider-api

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "identity-provider-api/dist/index.js"]
