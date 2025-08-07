"""
Production Django settings
• SITE_NAME is derived from the last folder of SITE_PATH.
• Database *name* and *user* default to that SITE_NAME.
• Only three secrets are absolutely required: SITE_PATH, DJANGO_SECRET_KEY, POSTGRES_PASSWORD.
"""

from __future__ import annotations
from pathlib import Path
import os
from django.core.exceptions import ImproperlyConfigured

# Optional .env loader for local tests
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except ModuleNotFoundError:
    pass

# ─────────────────────────────────────────────────────────────────────────────
# helpers
# ─────────────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent


def env(key: str, default: str | None = None, *, required: bool = False) -> str:
    """Return env var or default; raise if required and missing."""
    val = os.getenv(key, default)
    if required and val is None:
        raise ImproperlyConfigured(f"Set the {key} environment variable.")
    return val


SITE_PATH = env("SITE_PATH", str(BASE_DIR.parent), required=True)
SITE_NAME = Path(SITE_PATH).name  # e.g. zetaslate

# ─────────────────────────────────────────────────────────────────────────────
# core
# ─────────────────────────────────────────────────────────────────────────────
SECRET_KEY = env("DJANGO_SECRET_KEY", required=True)
DEBUG =True 
#env("DJANGO_DEBUG", "False").lower() == "true"

# Update your ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS handling:
# settings.py (updated but keeping your style)

# Allowed hosts - now with clear documentation
ALLOWED_HOSTS = [
    # one long CSV string works too, but a list is clearer
    f"{SITE_NAME}.com",
    f"www.{SITE_NAME}.com",
    f"admin.{SITE_NAME}.com",
    f"api.{SITE_NAME}.com",
    "localhost",
    "127.0.0.1",
]

# CSRF - explicitly including all needed origins
# backend/settings.py  – CSRF_TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = (
    env(
        "DJANGO_CSRF_TRUSTED",
        default=(
            f"https://{SITE_NAME}.com,"
            f"https://www.{SITE_NAME}.com,"
            f"https://admin.{SITE_NAME}.com,"
            f"https://api.{SITE_NAME}.com"
        ),
    ).split(",")
    if not DEBUG
    else []
)

# ─────────────────────────────────────────────────────────────────────────────
# apps & middleware
# ─────────────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "whitenoise.runserver_nostatic",
    "django_hosts",
    "blogapi"
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django_hosts.middleware.HostsResponseMiddleware",
    "django_hosts.middleware.HostsRequestMiddleware"
]

ROOT_URLCONF = "backend.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]
WSGI_APPLICATION = "backend.wsgi.application"

# ─────────────────────────────────────────────────────────────────────────────
# database (PostgreSQL)
# ─────────────────────────────────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", SITE_NAME),
        "USER": env("POSTGRES_USER", SITE_NAME),
        "PASSWORD": env("POSTGRES_PASSWORD", required=True),
        "HOST": env("POSTGRES_HOST", "localhost"),
        "PORT": env("POSTGRES_PORT", "5432"),
        "CONN_MAX_AGE": int(env("POSTGRES_CONN_MAX_AGE", "60")),
        "OPTIONS": {
            "sslmode": env("POSTGRES_SSLMODE", "prefer"),
        },
    }
}

# ─────────────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(env("DJANGO_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{asctime}] {levelname} {name} – {message}",
            "style": "{",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"handlers": ["console"], "level": "INFO" if DEBUG else "WARNING"},
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
ROOT_HOSTCONF = 'backend.hosts'   # dotted path to hosts.py
DEFAULT_HOST  = 'api'                     # the name you chose above
