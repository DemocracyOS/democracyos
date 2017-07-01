FROM node:6-alpine

MAINTAINER Guido Vilariño <guido@democracyos.org>

ENV NODE_ENV=production \
    NODE_PATH=/usr/src

RUN apk add --no-cache \
      git

WORKDIR /usr/src

COPY . /usr/src/

RUN npm install --quiet --production

RUN npm run build -- --minify

ONBUILD COPY ./ext ext

ONBUILD RUN bin/dos-ext-install --quiet

ONBUILD RUN npm run build -- --minify

CMD ["node", "index.js"]

EXPOSE 3000
