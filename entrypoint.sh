#!/bin/sh

set -e

mkdir -p "data"
if [ ! -f "data/db.sqlite3" ]; then
  python manage.py migrate --noinput
  if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python manage.py createsuperuser --noinput \
      --username "$DJANGO_SUPERUSER_USERNAME" \
      --email "${DJANGO_SUPERUSER_EMAIL:-admin@example.com}" || true
  fi
else
  python manage.py migrate --noinput
fi

python manage.py collectstatic --noinput

exec "$@"