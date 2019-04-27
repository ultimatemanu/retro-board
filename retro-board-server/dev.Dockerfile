FROM node:alpine

WORKDIR /app

RUN npm i -g yarn
COPY package.json .
COPY ../retro-board-common/src ./node_modules/retro-board-common/
RUN yarn
COPY . .

CMD ["yarn", "start"]