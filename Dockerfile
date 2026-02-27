FROM oven/bun:1.3.10-slim AS build

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production

COPY package.json bun.lock ./

RUN bun install 

COPY . .

RUN bun run build

FROM oven/bun:1.3.10-slim AS pack

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production

ENV HOSTNAME=0.0.0.0

COPY --from=build /app/.next/standalone .
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

CMD ["bun", "server.js"]
