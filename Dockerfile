FROM node:24-alpine3.22 AS build

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine3.22 AS pack

WORKDIR /app

ENV HOSTNAME=0.0.0.0

COPY --from=build /app/.next/standalone .
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

CMD ["node", "server.js"]
