FROM node:lts-alpine AS base

# Instala dependências essenciais
RUN apk add --no-cache libc6-compat

# ---------

FROM base AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# ---------

FROM base AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ---------

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 api

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

USER api

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/http/server.js"]
