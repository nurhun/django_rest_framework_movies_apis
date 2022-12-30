FROM python:3.8.10-slim

WORKDIR /usr/src/app
COPY ./backend/moviesapi .
COPY ./backend/requirements.txt .

RUN pip install --upgrade pip && \
    pip install gunicorn && \
    pip install -r requirements.txt && \
    apt update --allow-unauthenticated --allow-insecure-repositories && \
    apt install -y curl wget

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

ENTRYPOINT ["/bin/sh"]
# CMD ["-c", "gunicorn moviesapi.wsgi --bind=0.0.0.0:8000 --reload --workers=2 --threads=2 --timeout=120 --log-level=Debug"]