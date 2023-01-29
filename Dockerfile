FROM node:12.22-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 3004

RUN apk add --no-cache python2 g++ make

RUN npm install
RUN npm uninstall sqlite3
RUN npm install sqlite3
FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon
COPY . ./
CMD ["nodemon", "app.js"]
