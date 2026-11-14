from .base import *

# Comma-separated list of origins, scheme included (e.g. "https://portal.example.org")
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

USE_X_FORWARDED_HOST = True

# Cookies cohérents avec le HTTPS
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# Known and accepted, so `check --deploy` only reports new issues:
# Traefik handles the HTTPS redirect and HSTS, and the app sends no email.
SILENCED_SYSTEM_CHECKS = ["security.W004", "security.W008", "mail.E001"]
