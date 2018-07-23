FROM node:10 as node-builder
ADD . /code
WORKDIR /code
RUN npm install
RUN npm run lint
RUN npm run build

FROM cibuilds/hugo:latest as go-builder
RUN mkdir -p /code
COPY --from=node-builder /code/config.toml /code/config.toml
COPY --from=node-builder /code/archetypes /code/archetypes
COPY --from=node-builder /code/content /code/content
COPY --from=node-builder /code/layouts /code/layouts
COPY --from=node-builder /code/themes /code/themes
WORKDIR /code
RUN hugo

FROM nginx:mainline-alpine
LABEL maintainer="alberto@berriart.com"
COPY --from=go-builder /code/public /usr/share/nginx/html
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
