FROM node:17-alpine as base

RUN mkdir /var/www
RUN mkdir /var/www/html
RUN mkdir /var/www/html/app
RUN mkdir /var/www/html/app/web
RUN mkdir /var/www/html/app/web/node_modules

VOLUME [ "/var/www/html/app/web" ]
VOLUME [ "/var/www/html/app/web/node_modules" ]

ENV CHOKIDAR_USEPOLLING=true

WORKDIR /var/www/html/app/web

COPY ./web/package.json ./package.json
COPY ./web/index.html ./index.html
COPY ./web/tsconfig.json ./tsconfig.json
COPY ./web/vite.config.ts ./vite.config.ts

RUN npm install

###################################
FROM base as dev

EXPOSE 8000

###################################d
FROM dev as test

RUN mkdir /var/www/html/.git

VOLUME [ "/var/www/html/.git" ]

RUN apk update -q
RUN apk add -q git

ENV GIT_DIR=/var/www/html/.git
ENV GIT_WORK_TREE=/var/www/html/app/web
ENV NODE_OPTIONS=--experimental-vm-modules

COPY ./web/.babelrc ./.babelrc
COPY ./web/jest.config.json ./jest.config.json
