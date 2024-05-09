FROM node:20-alpine

RUN node -v
RUN npm install -g pnpm

ENV TZ=Asia/Shanghai

WORKDIR /app

COPY package.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

EXPOSE 3000
CMD ["npm", "start"]
