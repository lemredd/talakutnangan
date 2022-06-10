FROM node:16-alpine as base

RUN mkdir /var/www
RUN mkdir /var/www/html
RUN mkdir /var/www/html/app
RUN mkdir /var/www/html/app/base

ENV CHOKIDAR_USEPOLLING=true

VOLUME [ "/var/www/html/app" ]
VOLUME [ "/var/www/html/app/base" ]

WORKDIR /var/www/html/app

COPY ./.env ./.env
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./vite.config.ts ./vite.config.ts
COPY ./vue.d.ts ./vue.d.ts
COPY ./.sequelizerc ./.sequelizerc

RUN ln -s base/database database
RUN ln -s base/server server
RUN ln -s base/renderer renderer
RUN ln -s base/pages pages
RUN ln -s base/components components

RUN npm install -g npm@8.12.1
RUN npm install
RUN npm run migrate:up

###################################
FROM base as dev

EXPOSE 3000

###################################d
FROM dev as test

RUN mkdir /var/www/html/.git

VOLUME [ "/var/www/html/.git" ]

RUN apk update -q
RUN apk add -q git

ENV GIT_DIR=/var/www/html/.git
ENV NODE_OPTIONS=--experimental-vm-modules

COPY ./.babelrc ./.babelrc
COPY ./jest.front.config.json ./jest.front.config.json
COPY ./jest.back.config.json ./jest.back.config.json
COPY ./jest.back.intg.config.json ./jest.back.intg.config.json
