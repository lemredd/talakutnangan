FROM node:17-alpine as base

RUN mkdir /var/www
RUN mkdir /var/www/html
RUN mkdir /var/www/html/app
RUN mkdir /var/www/html/app/pages
RUN mkdir /var/www/html/app/.nuxt
RUN mkdir /var/www/html/app/server
RUN mkdir /var/www/html/app/plugins
RUN mkdir /var/www/html/app/components
RUN mkdir /var/www/html/app/composables

VOLUME [ "/var/www/html/app/pages" ]
VOLUME [ "/var/www/html/app/.nuxt" ]
VOLUME [ "/var/www/html/app/server" ]
VOLUME [ "/var/www/html/app/plugins" ]
VOLUME [ "/var/www/html/app/components" ]
VOLUME [ "/var/www/html/app/composables" ]

ENV CHOKIDAR_USEPOLLING=true

WORKDIR /var/www/html/app

COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./nuxt.config.ts ./nuxt.config.ts

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
ENV NODE_OPTIONS=--experimental-vm-modules

COPY ./.babelrc ./.babelrc
COPY ./jest.config.json ./jest.config.json
