# ---- Python base shared by dev and production ----
FROM python:3.14-slim AS python-base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_ROOT_USER_ACTION=ignore
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# ---- Dev: source is bind-mounted by docker-compose.override.yaml ----
FROM python-base AS dev
COPY requirements-dev.txt .
RUN pip install -r requirements-dev.txt
EXPOSE 8000
ENTRYPOINT ["sh", "/app/scripts/entrypoints/entrypoint.dev.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ---- Frontend build ----
FROM node:26-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Production ----
FROM python-base AS production
ENV DJANGO_SETTINGS_MODULE=app_portal.settings.prod

COPY manage.py ./
COPY app_portal/ app_portal/
COPY apps/ apps/
COPY --from=frontend /frontend/dist frontend/dist
COPY scripts/entrypoints/entrypoint.prod.sh /entrypoint.sh

# Runs as Unraid's nobody:users (99:100), the owner expected on appdata shares.
RUN python manage.py collectstatic --noinput \
    && useradd --uid 99 --gid 100 --no-create-home --shell /usr/sbin/nologin app \
    && mkdir -p data \
    && chown app:users data

USER app
EXPOSE 8000
ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["gunicorn", "app_portal.wsgi", "--bind", "0.0.0.0:8000", "--workers", "2", "--access-logfile", "-"]
