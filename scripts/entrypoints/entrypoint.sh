#!/bin/sh

set -e

mkdir -p "data"
python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"