FROM node:20-alpine AS build

WORKDIR /usr/src/app

ARG APP_MODE=prod
ARG API_URL=https://api.vergo.happykiller.net
ARG DEBUG=false

ENV APP_MODE=${APP_MODE} \
    API_URL=${API_URL} \
    DEBUG=${DEBUG}

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
