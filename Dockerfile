FROM node:14-slim

WORKDIR /app

COPY . .

RUN npm install -g serve

CMD ["serve", "-s", "."]