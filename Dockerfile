FROM python:3.14-slim AS base
WORKDIR /app

FROM base AS dev

RUN apt update && apt upgrade -y --no-install-recommends

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install  --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production

RUN apt update && apt upgrade -y --no-install-recommends

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install  --no-cache-dir -r requirements.txt

RUN useradd --create-home --uid 1000 app && chown app:app /app
USER app
COPY --chown=app:app . .

EXPOSE 8000

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
CMD ["gunicorn", "app_portal.wsgi", "--bind", "0.0.0.0:8000"]