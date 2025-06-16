from pathlib import Path
from environs import Env
env = Env()
env.read_env()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SECRET_KEY = env("DJANGO_SECRET_KEY", "CHANGE-ME")
DEBUG      = env.bool("DJANGO_DEBUG", False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

DATABASES = {
    "default": env.dj_db_url(
        "DATABASE_URL",
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
