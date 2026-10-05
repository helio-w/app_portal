from .base import *

MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

USE_X_FORWARDED_HOST = True

# Cookies cohérents avec le HTTPS
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True