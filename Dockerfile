FROM node:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install yarn
RUN yarn install

COPY . /usr/src/bot

CMD ["node", "main.js"]

