FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

RUN npm install -g serve

EXPOSE 3000

CMD ["npm", "run", "start"]
