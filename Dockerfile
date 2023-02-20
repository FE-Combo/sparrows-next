FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM node:alpine AS builder
WORKDIR /resource
COPY ./ /resource/
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build
## 清除 dev 依赖
RUN npm install -g npm@9.1.2
RUN npm prune --omit=dev --legacy-peer-deps

## 清除 dep 无用文件
FROM softonic/node-prune:latest AS pruner
WORKDIR /pruner
COPY --from=builder /resource/node_modules /pruner/node_modules
RUN node-prune /pruner/node_modules

FROM node:alpine AS runner
WORKDIR /www
ENV NODE_ENV production
COPY --from=builder /resource/next.config.js /www
COPY --from=builder /resource/koa.config.js /www
COPY --from=builder /resource/.next /www/.next
COPY --from=pruner /pruner/node_modules /www/node_modules
COPY --from=builder /resource/package.json /www/package.json
COPY --from=builder ./resource/public/favicon.ico /www/public/favicon.ico

EXPOSE 3000

CMD "yarn" "start"