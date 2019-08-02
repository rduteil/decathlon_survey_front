FROM node:8-alpine

COPY . build

ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install -g serve

CMD serve -s build

EXPOSE 5000
