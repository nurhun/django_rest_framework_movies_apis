FROM python:3.8.10-slim

WORKDIR /usr/src/app
COPY ./backend/moviesapi .
COPY ./backend/requirements.txt .

RUN pip install --upgrade pip && \
    pip install gunicorn && \
    pip install -r requirements.txt && \
    apt update && \
    apt install -y curl wget

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV DEBUG=1
ENV SECRET_KEY='classified'
ENV DJANGO_ALLOWED_HOSTS='* localhost 127.0.0.1 0.0.0.0 [::1]'
ENV FRONTEND_HTTP="http://nginx:80"
EXPOSE 8000


ENTRYPOINT ["/bin/sh"]
# CMD ["-c", "gunicorn moviesapi.wsgi --bind=0.0.0.0:8000 --reload --workers=2 --threads=2 --timeout=120 --log-level=warning"]