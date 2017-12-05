FROM node:6-alpine

MAINTAINER Guido Vilariño <guido@democracyos.org>

ENV NODE_ENV=development \
    NODE_PATH=/usr/src

RUN apk add --no-cache \
      git

COPY . /usr/src/

WORKDIR /usr/src

RUN npm install --quiet

CMD ["./node_modules/.bin/gulp", "bws"]

EXPOSE 3000
