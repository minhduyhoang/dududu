FROM node:18 AS dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

EXPOSE 3009

CMD ["npm", "run", "start:dev"]

FROM node:18 AS prod

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

EXPOSE 3009

CMD ["npm", "run", "start:prod"]
