# Build React static files
FROM node:13.12.0-alpine as BUILD

WORKDIR /app
COPY ./frontend/ /app

# Setting any environment variables on server after the build has no effect on the compiled file.
# So, ENVs need to be injected in the compile/build time not in the runtime.
# That's why need to pass it as ARGs not only ENVs

ARG REACT_APP_AXIOS_DEVELOPMENT_BASEURL
ARG REACT_APP_AXIOS_PRODUCTION_BASEURL

ENV REACT_APP_AXIOS_DEVELOPMENT_BASEURL $REACT_APP_AXIOS_DEVELOPMENT_BASEURL
ENV REACT_APP_AXIOS_PRODUCTION_BASEURL $REACT_APP_AXIOS_PRODUCTION_BASEURL

RUN npm ci --silent
RUN npm run build


# Copy React static files and start nginx
FROM nginx:1.23-alpine

COPY --from=BUILD /app/build /usr/share/nginx/html
COPY ./backend/moviesapi/django_static /usr/src/static
COPY ./docker/nginx/templates /etc/nginx/templates

CMD ["nginx", "-g", "daemon off;"]