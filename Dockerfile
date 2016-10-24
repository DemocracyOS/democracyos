FROM node:argon

MAINTAINER Guido Vilariño <guido@democracyos.org>

RUN npm config set python python2.7

COPY ["package.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install --quiet --production

COPY [".", "/usr/src/"]

RUN npm run build -- --minify

ENV NODE_ENV=production \
    NODE_PATH=.

EXPOSE 3000

CMD ["node", "index.js"]
