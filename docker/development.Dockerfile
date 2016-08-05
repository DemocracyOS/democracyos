FROM node:argon
MAINTAINER Guido Vilariño <guido@democracyos.org>

RUN apt-get update && \
  apt-get install -y libkrb5-dev && \
  npm config set python python2.7

COPY package.json /usr/src/

WORKDIR /usr/src

RUN npm install --quiet --unsafe-perm

ENV NODE_PATH=.

EXPOSE 3000

CMD ["./node_modules/.bin/gulp", "bws"]
