FROM node:20-alpine

RUN node -v

ENV TZ=Asia/Shanghai

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
