FROM node:alpine as builder
WORKDIR /app
RUN npm i -g yarn
COPY package.json .
COPY retro-board-app/package.json retro-board-app/package.json
COPY retro-board-server/package.json retro-board-server/package.json
COPY retro-board-common/package.json retro-board-common/package.json
RUN yarn
COPY . .
RUN yarn build

FROM nginx
COPY --from=builder /app/retro-board-app/build /usr/share/nginx/html